import { ErrorMessage } from './app-strings'

export function getErrorStatus(error: any): number {
  if (error?.status === 429) return 429
  if (error?.status === 401) return 401
  if (error?.status === 400) return 400
  if (error?.status >= 500) return error.status
  return 500
}

export function getRetryAfter(error: any): number | undefined {
  if (error?.status === 429) {
    return 60
  }
  return undefined
}

export function getErrorMessage(error: any, defaultMessage: string = ErrorMessage.FailedToGetResponse): string {
  const status = getErrorStatus(error)

  if (status === 429) {
    return ErrorMessage.RateLimit
  }
  if (status === 401) {
    return ErrorMessage.InvalidApiKey
  }
  if (error?.message) {
    if (error.message.includes('GROQ_API_KEY') || error.message.includes('API key')) {
      return ErrorMessage.ApiKeyMissingOrInvalid
    }
    return error.message
  }

  return defaultMessage
}
