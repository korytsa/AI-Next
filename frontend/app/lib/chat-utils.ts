import { openai, DEFAULT_MODEL, DEFAULT_TEMPERATURE } from './openai'
import { 
  SHORT_RESPONSE_EXAMPLES, 
  DETAILED_RESPONSE_EXAMPLES,
  getFewShotPrompt 
} from './few-shot-examples'
import { getChainOfThoughtPrompt, ChainOfThoughtMode } from './chain-of-thought'

export type ResponseMode = 'short' | 'detailed'

export function getSystemMessage(
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed', 
  useFewShot: boolean = true,
  chainOfThought: ChainOfThoughtMode = 'none'
) {
  let baseContent = 'You are a fun, friendly, and easygoing friend. Be cheerful, lighthearted, and entertaining. Use casual language, jokes, and emojis when appropriate. Keep the conversation fun and engaging while still being helpful.'
  
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

export function prepareMessages(
  messages: any[], 
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed',
  chainOfThought: ChainOfThoughtMode = 'none'
) {
  return [getSystemMessage(userName, responseMode, true, chainOfThought), ...messages]
}

export function createChatCompletion(
  messages: any[], 
  stream: boolean = false, 
  userName?: string | null, 
  responseMode: ResponseMode = 'detailed',
  chainOfThought: ChainOfThoughtMode = 'none'
) {
  return openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: prepareMessages(messages, userName, responseMode, chainOfThought),
    temperature: DEFAULT_TEMPERATURE,
    stream,
  })
}
