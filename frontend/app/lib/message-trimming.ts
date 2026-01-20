export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type TrimmingStrategy = 'last_n_messages' | 'last_n_tokens' | 'smart' | 'none'

export interface TrimmingOptions {
  strategy: TrimmingStrategy
  maxMessages?: number
  maxTokens?: number
  keepSystemMessage?: boolean
  keepFirstMessages?: number
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
    strategy: 'smart',
    maxTokens: 6000,
    keepSystemMessage: true,
    keepFirstMessages: 2,
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

  if (options.strategy === 'last_n_tokens' || options.strategy === 'smart') {
    const maxTokens = options.maxTokens || 6000
    const result: Message[] = []

    if (options.keepSystemMessage !== false && systemMessages.length > 0) {
      result.push(...systemMessages)
    }

    let currentTokens = countTokens(result)

    if (options.strategy === 'smart' && options.keepFirstMessages && options.keepFirstMessages > 0) {
      const firstMessages = nonSystemMessages.slice(0, options.keepFirstMessages)
      const firstMessagesToKeep: Message[] = []
      
      for (const msg of firstMessages) {
        const msgTokens = estimateTokens(msg.content)
        if (currentTokens + msgTokens <= maxTokens) {
          firstMessagesToKeep.push(msg)
          currentTokens += msgTokens
        } else {
          break
        }
      }

      const remainingTokens = maxTokens - currentTokens
      const lastMessagesToKeep: Message[] = []
      let lastTokens = 0

      for (let i = nonSystemMessages.length - 1; i >= firstMessagesToKeep.length; i--) {
        const msg = nonSystemMessages[i]
        const msgTokens = estimateTokens(msg.content)

        if (lastTokens + msgTokens <= remainingTokens) {
          lastMessagesToKeep.unshift(msg)
          lastTokens += msgTokens
        } else {
          break
        }
      }

      return [...result, ...firstMessagesToKeep, ...lastMessagesToKeep]
    }

    for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
      const msg = nonSystemMessages[i]
      const msgTokens = estimateTokens(msg.content)

      if (currentTokens + msgTokens <= maxTokens) {
        result.unshift(msg)
        currentTokens += msgTokens
      } else {
        break
      }
    }

    return result
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
