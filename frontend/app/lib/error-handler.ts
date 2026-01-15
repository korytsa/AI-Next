export interface ChatError {
  message: string
  type: 'rate_limit' | 'network' | 'server' | 'unknown'
  retryable: boolean
  retryAfter?: number 
}

export function parseError(error: any, response?: Response): ChatError {
  if (response?.status === 429) {
    const retryAfter = response.headers.get('retry-after')
    const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined

    return {
      message: 'Too many requests. Please wait a moment and try again.',
      type: 'rate_limit',
      retryable: true,
      retryAfter: retryAfterSeconds,
    }
  }

  if (!response || error instanceof TypeError || error.message?.includes('fetch')) {
    return {
      message: 'Network error. Please check your internet connection and try again.',
      type: 'network',
      retryable: true,
    }
  }

  if (response.status >= 500) {
    return {
      message: 'Server error. Please try again in a moment.',
      type: 'server',
      retryable: true,
    }
  }

  if (response.status >= 400) {
    const errorMessage = error.message || 'Invalid request. Please check your input.'
    return {
      message: errorMessage,
      type: 'server',
      retryable: false,
    }
  }

  return {
    message: error.message || 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    retryable: true,
  }
}

export function getErrorMessage(error: ChatError): string {
  if (error.type === 'rate_limit' && error.retryAfter) {
    return `${error.message} (Retry after ${error.retryAfter} seconds)`
  }
  return error.message
}
