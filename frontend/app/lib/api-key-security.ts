export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return '****'
  }

  const prefix = apiKey.substring(0, 4)
  const suffix = apiKey.substring(apiKey.length - 4)
  const masked = '*'.repeat(Math.max(apiKey.length - 8, 4))

  return `${prefix}${masked}${suffix}`
}

export function sanitizeErrorForLogging(error: any): any {
  if (!error || typeof error !== 'object') {
    return error
  }

  const sanitized = { ...error }

  if (sanitized.apiKey) {
    sanitized.apiKey = maskApiKey(String(sanitized.apiKey))
  }

  return sanitized
}

export function getApiKeyFromEnv(): string | null {
  const apiKey = process.env.GROQ_API_KEY

  if (!apiKey || !apiKey.trim()) {
    return null
  }

  const trimmedKey = apiKey.trim()

  if (!trimmedKey.startsWith('gsk_')) {
    throw new Error('Invalid API key format. Groq API keys should start with "gsk_"')
  }

  return trimmedKey
}
