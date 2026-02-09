import { openai, DEFAULT_MODEL } from './openai'
import { Message } from './message-trimming'
import { SummarizationPrompt } from './prompts'

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
    ? `${SummarizationPrompt.WithKeyInfo(maxSummaryTokens)}${conversationText}${SummarizationPrompt.SummarySuffix}`
    : `${SummarizationPrompt.Brief(maxSummaryTokens)}${conversationText}${SummarizationPrompt.SummarySuffix}`

  try {
    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: SummarizationPrompt.SystemRole },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: maxSummaryTokens,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error summarizing messages:', error)
    return SummarizationPrompt.Fallback(messages.length)
  }
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
