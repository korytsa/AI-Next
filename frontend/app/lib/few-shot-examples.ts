import {
  FewShotExample,
  SHORT_RESPONSE_EXAMPLES,
  DETAILED_RESPONSE_EXAMPLES,
  FewShotPrompt,
} from './prompts'

export type { FewShotExample }
export { SHORT_RESPONSE_EXAMPLES, DETAILED_RESPONSE_EXAMPLES }

export function formatFewShotExamples(examples: FewShotExample[]): string {
  return examples
    .map((example, index) =>
      FewShotPrompt.ExampleFormat(index, example.user, example.assistant)
    )
    .join('\n\n')
}

export function getFewShotPrompt(examples: FewShotExample[], context?: string): string {
  const examplesText = formatFewShotExamples(examples)
  const contextText = context ? `\n\nContext: ${context}` : ''
  return `${FewShotPrompt.Intro}\n\n${examplesText}${contextText}\n\n${FewShotPrompt.FollowStyle}`
}
