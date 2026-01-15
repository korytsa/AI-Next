export type ChainOfThoughtMode = 'none' | 'short' | 'detailed'

export function getChainOfThoughtPrompt(mode: ChainOfThoughtMode): string {
  if (mode === 'none') {
    return ''
  }

  if (mode === 'short') {
    return `IMPORTANT: When answering questions, show your thinking process VERY BRIEFLY using only 1-2 short bullet points before your answer. Keep the reasoning minimal and concise. Example format:

• Quick thought: [one sentence]
• Answer: [your answer]

Do NOT use numbered lists or detailed explanations. Keep it extremely brief.`
  }

  if (mode === 'detailed') {
    return `When answering questions, break down your thinking process step by step:

1. **Understand the question**: What is the user really asking?
2. **Identify key information**: What facts or data are relevant?
3. **Plan your approach**: How will you solve this?
4. **Work through the solution**: Show each step with brief explanations
5. **Provide the final answer**: Give a clear conclusion

Use this structure for complex questions. Be clear and organized, but keep explanations concise. For simple questions, you can use fewer steps.`
  }

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
