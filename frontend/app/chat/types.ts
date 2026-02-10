import { ChatError } from '@/app/lib/errors'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  error?: ChatError
}
