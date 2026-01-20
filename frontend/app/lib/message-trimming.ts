export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type TrimmingStrategy = 'last_n_messages' | 'last_n_tokens' | 'smart' | 'summarize' | 'none'

export interface TrimmingOptions {
  strategy: TrimmingStrategy
  maxMessages?: number
  maxTokens?: number
  keepSystemMessage?: boolean
  keepFirstMessages?: number
  summarizeThreshold?: number
  maxSummaryTokens?: number
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
    strategy: 'summarize',
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

export async function trimAndSummarizeMessages(
  messages: Message[],
  options: TrimmingOptions = {
    strategy: 'summarize',
    maxTokens: 4000,
    keepSystemMessage: true,
    keepFirstMessages: 2,
    summarizeThreshold: 0.5,
    maxSummaryTokens: 200,
  }
): Promise<Message[]> {
  if (options.strategy !== 'summarize' || messages.length === 0) {
    return trimMessages(messages, options)
  }

  const { summarizeMessages } = await import('./message-summarization')
  
  const systemMessages = messages.filter((msg) => msg.role === 'system')
  const nonSystemMessages = messages.filter((msg) => msg.role !== 'system')
  
  if (nonSystemMessages.length === 0) {
    return messages
  }

  const maxTokens = options.maxTokens || 4000
  const summarizeThreshold = options.summarizeThreshold || 0.5
  const keepFirstMessages = options.keepFirstMessages || 2

  const result: Message[] = []

  if (options.keepSystemMessage !== false && systemMessages.length > 0) {
    result.push(...systemMessages)
  }

  let currentTokens = countTokens(result)

  const firstMessagesToKeep: Message[] = []
  const firstMessages = nonSystemMessages.slice(0, keepFirstMessages)
  
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
  const maxLastMessages = 25
  const lastMessagesToKeep: Message[] = []
  let lastTokens = 0

  const startIndex = Math.max(
    firstMessagesToKeep.length,
    nonSystemMessages.length - maxLastMessages
  )

  for (let i = nonSystemMessages.length - 1; i >= startIndex; i--) {
    const msg = nonSystemMessages[i]
    const msgTokens = estimateTokens(msg.content)

    if (lastTokens + msgTokens <= remainingTokens) {
      lastMessagesToKeep.unshift(msg)
      lastTokens += msgTokens
    } else {
      break
    }
  }

  const messagesToSummarize = nonSystemMessages.slice(
    firstMessagesToKeep.length,
    nonSystemMessages.length - lastMessagesToKeep.length
  )

  if (messagesToSummarize.length > 0) {
    const totalTokens = countTokens(messagesToSummarize)
    const thresholdTokens = maxTokens * summarizeThreshold
    const minMessagesToSummarize = 5

    if (messagesToSummarize.length >= minMessagesToSummarize && totalTokens > thresholdTokens) {
      const summary = await summarizeMessages(messagesToSummarize, {
        maxSummaryTokens: options.maxSummaryTokens || 200,
        preserveKeyInfo: true,
      })

      const summaryMessage: Message = {
        role: 'system',
        content: `[Summary of previous conversation: ${summary}]`,
      }

      const summaryTokens = estimateTokens(summaryMessage.content)

      if (currentTokens + summaryTokens + lastTokens <= maxTokens) {
        result.push(...firstMessagesToKeep, summaryMessage, ...lastMessagesToKeep)
      } else {
        result.push(...firstMessagesToKeep, ...lastMessagesToKeep)
      }
    } else {
      result.push(...firstMessagesToKeep, ...lastMessagesToKeep)
    }
  } else {
    result.push(...firstMessagesToKeep, ...lastMessagesToKeep)
  }

  return result
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
