import { ChatError } from '@/app/lib/error-handler'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  error?: ChatError
}
