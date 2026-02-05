import { Message } from '../types'
import { ChatError, parseError } from '@/app/lib/error-handler'
import { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

export function isChatError(error: any): error is ChatError {
  return error && typeof error === 'object' && 'type' in error && 'retryable' in error
}

export function parseChatError(error: any): ChatError {
  return isChatError(error) ? error : parseError(error)
}

export function createErrorMessage(prev: Message, error: ChatError): Message {
  return prev.role === 'assistant'
    ? { ...prev, content: '', error }
    : { role: 'assistant', content: '', error }
}

export function createRequestBody(
  messagesToSend: Message[],
  userName: string | null | undefined,
  responseMode: ResponseMode,
  chainOfThought: ChainOfThoughtMode,
  selectedModel: string,
  useRAG: boolean = false,
  ragMaxDocuments: number = 3,
  useCache: boolean = false
) {
  return {
    messages: messagesToSend.map((m) => ({ role: m.role, content: m.content })),
    userName,
    responseMode,
    chainOfThought,
    model: selectedModel,
    useRAG,
    ragMaxDocuments,
    useCache,
  }
}

export function handleError(
  error: any,
  retryCount: number,
  retryFn: () => Promise<void>
): Promise<void> {
  const chatError = parseChatError(error)
  
  if (chatError.type === 'validation_error' || chatError.type === 'moderation_error') {
    throw chatError
  }
  
  if (chatError.retryable && retryCount < 3) {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(retryFn()), delay)
    })
  }
  
  throw chatError
}
