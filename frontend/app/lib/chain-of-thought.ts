import { ChainOfThoughtPrompt } from './prompts'

export type ChainOfThoughtMode = 'none' | 'short' | 'detailed'

export function getChainOfThoughtPrompt(mode: ChainOfThoughtMode): string {
  if (mode === 'none') return ''
  if (mode === 'short') return ChainOfThoughtPrompt.Short
  if (mode === 'detailed') return ChainOfThoughtPrompt.Detailed
  return ''
}

export function shouldUseChainOfThought(userMessage: string, mode: ChainOfThoughtMode): boolean {
  if (mode === 'none') return false

  const complexKeywords = [
    'calculate', 'solve', 'explain how', 'why does', 'how does',
    'рассчитай', 'реши', 'объясни как', 'почему', 'как работает',
    'compare', 'analyze', 'difference between', 'what is the',
    'сравни', 'проанализируй', 'разница между', 'что такое'
  ]

  const lowerMessage = userMessage.toLowerCase()
  return complexKeywords.some(keyword => lowerMessage.includes(keyword))
}
