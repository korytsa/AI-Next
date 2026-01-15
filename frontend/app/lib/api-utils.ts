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

export function getErrorMessage(error: any, defaultMessage: string = 'Failed to get AI response'): string {
  const status = getErrorStatus(error)
  
  if (status === 429) {
    return 'Rate limit exceeded. Please wait a moment and try again.'
  } else if (status === 401) {
    return 'Invalid API key. Please check your configuration.'
  } else if (error?.message) {
    return error.message
  }
  
  return defaultMessage
}
