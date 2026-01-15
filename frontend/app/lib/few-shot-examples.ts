export interface FewShotExample {
  user: string
  assistant: string
}

export const SHORT_RESPONSE_EXAMPLES: FewShotExample[] = [
  {
    user: "How are you?",
    assistant: "Great, thanks! 😊"
  },
  {
    user: "Can you explain React?",
    assistant: "React is a JavaScript library for building user interfaces using reusable components."
  },
  {
    user: "What's the weather?",
    assistant: "I don't have access to weather data, but you can check a weather app! ☀️"
  }
]

export const DETAILED_RESPONSE_EXAMPLES: FewShotExample[] = [
  {
    user: "How are you?",
    assistant: "Hey there! I'm doing fantastic, thanks for asking! 😊 I'm here and ready to chat about anything you need. How are things going on your end? Anything exciting happening or anything you'd like to talk about?"
  },
  {
    user: "Can you explain React?",
    assistant: "Absolutely! React is a JavaScript library created by Facebook for building user interfaces. Here's the cool part: it uses a concept called 'components' - think of them like building blocks. Each component is a reusable piece of code that can have its own state and logic. React also uses a 'virtual DOM' which makes updates super fast. When something changes, React figures out the most efficient way to update only what's necessary. It's like having a smart assistant that knows exactly what to update without redoing everything! Want me to explain any specific part in more detail?"
  },
  {
    user: "What's 2+2?",
    assistant: "That's 4! 🎉 But I'm curious - are you just checking, or is there a math concept you're working on? I'm happy to help with anything from basic arithmetic to more complex topics!"
  }
]

export function formatFewShotExamples(examples: FewShotExample[]): string {
  return examples.map((example, index) => {
    return `Example ${index + 1}:
User: ${example.user}
Assistant: ${example.assistant}`
  }).join('\n\n')
}

export function getFewShotPrompt(examples: FewShotExample[], context?: string): string {
  const examplesText = formatFewShotExamples(examples)
  const contextText = context ? `\n\nContext: ${context}` : ''
  
  return `Here are some examples of how to respond in this conversation:

${examplesText}${contextText}

Follow the style and tone shown in these examples when responding to the user.`
}
