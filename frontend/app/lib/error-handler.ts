export interface ChatError {
  message: string
  type: 'rate_limit' | 'network' | 'server' | 'validation_error' | 'moderation_error' | 'unknown'
  retryable: boolean
  retryAfter?: number
  details?: string[]
}

export function parseError(error: any, response?: Response): ChatError {
  const isContentError = error && typeof error === 'object' && (error.type === 'validation_error' || error.type === 'moderation_error')
  if (isContentError) {
    return {
      message: error.error || error.message || 'Your request contains content that violates our usage policy',
      type: error.type,
      retryable: false,
      details: error.details || [],
    }
  }

  if (response?.status === 429) {
    const retryAfter = response.headers.get('retry-after') || response.headers.get('Retry-After')
    return {
      message: 'Too many requests. Please wait a moment and try again.',
      type: 'rate_limit',
      retryable: true,
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
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
    const isValidationError = error.type === 'validation_error' || error.type === 'moderation_error'
    return {
      message: error.error || error.message || (isValidationError ? 'Your request contains invalid content' : 'Invalid request. Please check your input.'),
      type: isValidationError ? error.type : 'server',
      retryable: false,
      details: error.details || [],
    }
  }

  return {
    message: error.message || 'An unexpected error occurred. Please try again.',
    type: 'unknown',
    retryable: true,
  }
}

export function getErrorMessage(error: ChatError): string {
  return error.type === 'rate_limit' && error.retryAfter
    ? `${error.message} (Retry after ${error.retryAfter} seconds)`
    : error.message
}
