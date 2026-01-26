import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE, DEFAULT_MAX_TOKENS } from './openai'
import { 
  SHORT_RESPONSE_EXAMPLES, 
  DETAILED_RESPONSE_EXAMPLES,
  getFewShotPrompt 
} from './few-shot-examples'
import { getChainOfThoughtPrompt, ChainOfThoughtMode } from './chain-of-thought'
import { trimMessages, trimAndSummarizeMessages, TrimmingOptions } from './message-trimming'

export type ResponseMode = 'short' | 'detailed'

export function getSystemMessage(
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed', 
  useFewShot: boolean = true,
  chainOfThought: ChainOfThoughtMode = 'none'
) {
  let baseContent = 'You are a fun, friendly, and easygoing friend. Be cheerful, lighthearted, and entertaining. Use casual language, jokes, and emojis when appropriate. Keep the conversation fun and engaging while still being helpful.\n\nIMPORTANT: Always respond in the same language as the user\'s message. If the user writes in Russian, respond in Russian. If the user writes in English, respond in English. Match the language of each user message.'
  
  if (chainOfThought !== 'none') {
    const cotPrompt = getChainOfThoughtPrompt(chainOfThought)
    if (cotPrompt) {
      baseContent += `\n\n${cotPrompt}`
    }
  } else {
    if (responseMode === 'short') {
      baseContent += ' Provide concise, brief answers. Keep responses short and to the point, typically 1-3 sentences. Avoid lengthy explanations unless specifically requested.'
    } else {
      baseContent += ' Provide detailed, comprehensive answers. Include examples, explanations, and context when helpful. Elaborate on concepts to ensure thorough understanding.'
    }
  }
  
  if (useFewShot) {
    const examples = responseMode === 'short' ? SHORT_RESPONSE_EXAMPLES : DETAILED_RESPONSE_EXAMPLES
    const fewShotPrompt = getFewShotPrompt(examples)
    baseContent += `\n\n${fewShotPrompt}`
  }
  
  if (userName) {
    return {
      role: 'system' as const,
      content: `${baseContent} The user's name is ${userName}. Address them by name when appropriate to make the conversation more personal and friendly.`,
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
  trimmingOptions?: TrimmingOptions
) {
  const systemMessage = getSystemMessage(userName, responseMode, true, chainOfThought)
  const allMessages = [systemMessage, ...messages]

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
  model?: string
) {
  const preparedMessages = await prepareMessages(messages, userName, responseMode, chainOfThought, trimmingOptions)
  
  return openai.chat.completions.create({
    model: model || DEFAULT_MODEL,
    messages: preparedMessages,
    temperature: DEFAULT_TEMPERATURE,
    stream,
    max_tokens: DEFAULT_MAX_TOKENS,
  })
}
