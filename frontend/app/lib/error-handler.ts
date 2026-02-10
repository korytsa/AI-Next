import { ErrorType, ErrorMessage, type ErrorTypeValue } from './app-strings'

export interface ChatError {
  message: string
  type: ErrorTypeValue
  retryable: boolean
  retryAfter?: number
  details?: string[]
}

function getBaseMessage(error: any, fallback: string): string {
  return error?.error || error?.message || fallback
}

export function parseError(error: any, response?: Response): ChatError {
  const isContentError =
    error &&
    typeof error === 'object' &&
    (error.type === ErrorType.ValidationError || error.type === ErrorType.ModerationError)
  if (isContentError) {
    return {
      message: getBaseMessage(error, ErrorMessage.ValidationPolicy),
      type: error.type,
      retryable: false,
      details: error.details || [],
    }
  }

  if (response?.status === 429) {
    const retryAfter = response.headers.get('retry-after') || response.headers.get('Retry-After')
    return {
      message: ErrorMessage.RateLimit,
      type: ErrorType.RateLimit,
      retryable: true,
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
    }
  }

  if (!response || error instanceof TypeError || error.message?.includes('fetch')) {
    return {
      message: ErrorMessage.Network,
      type: ErrorType.Network,
      retryable: true,
    }
  }

  if (response.status >= 500) {
    return {
      message: ErrorMessage.Server,
      type: ErrorType.Server,
      retryable: true,
    }
  }

  if (response.status >= 400) {
    const isValidationError =
      error.type === ErrorType.ValidationError || error.type === ErrorType.ModerationError
    const fallback = isValidationError
      ? ErrorMessage.ValidationInvalidContent
      : ErrorMessage.InvalidRequest

    return {
      message: getBaseMessage(error, fallback),
      type: isValidationError ? error.type : ErrorType.Server,
      retryable: false,
      details: error.details || [],
    }
  }

  return {
    message: getBaseMessage(error, ErrorMessage.Unexpected),
    type: ErrorType.Unknown,
    retryable: true,
  }
}

export function getErrorMessage(error: ChatError): string {
  return error.type === ErrorType.RateLimit && error.retryAfter
    ? `${error.message} (Retry after ${error.retryAfter} seconds)`
    : error.message
}
