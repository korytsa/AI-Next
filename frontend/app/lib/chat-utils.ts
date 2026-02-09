import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from './openai'
import { SHORT_RESPONSE_EXAMPLES, DETAILED_RESPONSE_EXAMPLES, getFewShotPrompt } from './few-shot-examples'
import { getChainOfThoughtPrompt, ChainOfThoughtMode } from './chain-of-thought'
import { trimMessages, trimAndSummarizeMessages, TrimmingOptions } from './message-trimming'
import { retrieveContext } from './rag'
import { SystemPrompt, RagPrompt } from './prompts'

export type ResponseMode = 'short' | 'detailed'

export function getSystemMessage(
  userName?: string | null,
  responseMode: ResponseMode = 'detailed',
  useFewShot: boolean = true,
  chainOfThought: ChainOfThoughtMode = 'none'
) {
  let baseContent = `${SystemPrompt.Base}\n\n${SystemPrompt.LanguageRule}`

  if (chainOfThought !== 'none') {
    const cotPrompt = getChainOfThoughtPrompt(chainOfThought)
    if (cotPrompt) {
      baseContent += `\n\n${cotPrompt}`
    }
  } else {
    baseContent += responseMode === 'short' ? SystemPrompt.ShortMode : SystemPrompt.DetailedMode
  }

  if (useFewShot) {
    const examples = responseMode === 'short' ? SHORT_RESPONSE_EXAMPLES : DETAILED_RESPONSE_EXAMPLES
    const fewShotPrompt = getFewShotPrompt(examples)
    baseContent += `\n\n${fewShotPrompt}`
  }

  if (userName) {
    return {
      role: 'system' as const,
      content: `${baseContent}${SystemPrompt.UserNameSuffix(userName)}`,
    }
  }

  return {
    role: 'system' as const,
    content: baseContent,
  }
}

export function validateMessages(messages: any): boolean {
  return Array.isArray(messages) && messages.length > 0
}

export async function prepareMessages(
  messages: any[], 
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed',
  chainOfThought: ChainOfThoughtMode = 'none',
  trimmingOptions?: TrimmingOptions,
  useRAG: boolean = false,
  ragMaxDocuments: number = 3
) {
  const messagesToProcess = [...messages]
  const systemMessage = getSystemMessage(userName, responseMode, true, chainOfThought)

  if (useRAG && messagesToProcess.length > 0) {
    const lastUserMessage = messagesToProcess
      .slice()
      .reverse()
      .find((msg: any) => msg.role === 'user')
    
    if (lastUserMessage?.content) {
      const ragContext = await retrieveContext(lastUserMessage.content, ragMaxDocuments)
      
      if (ragContext.enabled && ragContext.formattedContext) {
        systemMessage.content = `${systemMessage.content}${RagPrompt.Instruction}\n${ragContext.formattedContext}`
      }
    }
  }

  const allMessages = [systemMessage, ...messagesToProcess]

  const options = trimmingOptions || {
    strategy: 'summarize' as const,
    maxTokens: 4000,
    keepSystemMessage: true,
    keepFirstMessages: 2,
    summarizeThreshold: 0.5,
    maxSummaryTokens: 200,
  }

  let prepared: any[]
  if (options.strategy === 'summarize') {
    prepared = await trimAndSummarizeMessages(allMessages, options)
  } else {
    prepared = trimMessages(allMessages, options)
  }

  return prepared
}

export async function createChatCompletion(
  messages: any[], 
  stream: boolean = false, 
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed',
  chainOfThought: ChainOfThoughtMode = 'none',
  trimmingOptions?: TrimmingOptions,
  model?: string,
  useRAG: boolean = false,
  ragMaxDocuments: number = 3
) {
  const preparedMessages = await prepareMessages(
    messages, 
    userName, 
    responseMode, 
    chainOfThought, 
    trimmingOptions,
    useRAG,
    ragMaxDocuments
  )
  
  return openai.chat.completions.create({
    model: model || DEFAULT_MODEL,
    messages: preparedMessages,
    temperature: DEFAULT_TEMPERATURE,
    stream,
    max_tokens: DEFAULT_MAX_TOKENS,
  })
}
