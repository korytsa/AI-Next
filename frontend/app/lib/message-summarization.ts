import { openai, DEFAULT_MODEL } from './openai'
import { Message } from './message-trimming'

export interface SummarizationOptions {
  maxSummaryTokens?: number
  preserveKeyInfo?: boolean
}

export async function summarizeMessages(
  messages: Message[],
  options: SummarizationOptions = {}
): Promise<string> {
  if (messages.length === 0) {
    return ''
  }

  const maxSummaryTokens = options.maxSummaryTokens || 200
  const preserveKeyInfo = options.preserveKeyInfo !== false

  const conversationText = messages
    .map((msg) => {
      const role = msg.role === 'user' ? 'User' : msg.role === 'assistant' ? 'Assistant' : 'System'
      return `${role}: ${msg.content}`
    })
    .join('\n\n')

  const prompt = preserveKeyInfo
    ? `Create a concise summary of the following conversation. Preserve important details like names, dates, decisions, and key topics. Keep it under ${maxSummaryTokens} tokens.

Conversation:
${conversationText}

Summary:`
    : `Create a brief summary of the following conversation. Keep it under ${maxSummaryTokens} tokens.

Conversation:
${conversationText}

Summary:`

  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates concise summaries of conversations.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: maxSummaryTokens,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error summarizing messages:', error)
    return `[Previous conversation: ${messages.length} messages]`
  }
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
