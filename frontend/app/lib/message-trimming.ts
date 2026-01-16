export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type TrimmingStrategy = 'last_n_messages' | 'last_n_tokens' | 'none'

export interface TrimmingOptions {
  strategy: TrimmingStrategy
  maxMessages?: number
  maxTokens?: number
  keepSystemMessage?: boolean
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

function countTokens(messages: Message[]): number {
  return messages.reduce((total, msg) => total + estimateTokens(msg.content), 0)
}

export function trimMessages(
  messages: Message[],
  options: TrimmingOptions = {
    strategy: 'last_n_messages',
    maxMessages: 20,
    keepSystemMessage: true,
  }
): Message[] {
  if (options.strategy === 'none' || messages.length === 0) {
    return messages
  }

  const systemMessages = messages.filter((msg) => msg.role === 'system')
  const nonSystemMessages = messages.filter((msg) => msg.role !== 'system')

  if (options.strategy === 'last_n_messages') {
    const maxMessages = options.maxMessages || 20
    const trimmed = nonSystemMessages.slice(-maxMessages)

    if (options.keepSystemMessage !== false && systemMessages.length > 0) {
      return [...systemMessages, ...trimmed]
    }

    return trimmed
  }

  if (options.strategy === 'last_n_tokens') {
    const maxTokens = options.maxTokens || 3000
    const result: Message[] = []

    if (options.keepSystemMessage !== false && systemMessages.length > 0) {
      result.push(...systemMessages)
    }

    let currentTokens = countTokens(result)

    for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
      const msg = nonSystemMessages[i]
      const msgTokens = estimateTokens(msg.content)

      if (currentTokens + msgTokens <= maxTokens) {
        result.push(msg)
        currentTokens += msgTokens
      } else {
        break
      }
    }

    return result.reverse()
  }

  return messages
}

export function getMessagesInfo(messages: Message[]): {
  totalMessages: number
  estimatedTokens: number
  systemMessages: number
  userMessages: number
  assistantMessages: number
} {
  const systemMessages = messages.filter((msg) => msg.role === 'system')
  const userMessages = messages.filter((msg) => msg.role === 'user')
  const assistantMessages = messages.filter((msg) => msg.role === 'assistant')

  return {
    totalMessages: messages.length,
    estimatedTokens: countTokens(messages),
    systemMessages: systemMessages.length,
    userMessages: userMessages.length,
    assistantMessages: assistantMessages.length,
  }
}
