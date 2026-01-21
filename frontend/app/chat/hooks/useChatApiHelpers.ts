import { ChatError, parseError } from '@/app/lib/error-handler'
import { Message } from '../types'

export function isChatError(error: any): error is ChatError {
  return error && typeof error === 'object' && 'type' in error && 'retryable' in error
}

export function parseChatError(error: any): ChatError {
  return isChatError(error) ? error : parseError(error)
}

export function createErrorMessage(prev: Message, error: ChatError): Message {
  if (prev.role === 'assistant') {
    return {
      ...prev,
      content: '',
      error,
    }
  }
  return {
    role: 'assistant',
    content: '',
    error,
  }
}
