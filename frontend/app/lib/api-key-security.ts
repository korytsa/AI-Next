import { ApiKeyError } from './app-strings'

export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '****'
  return `${apiKey.slice(0, 4)}${'*'.repeat(Math.max(apiKey.length - 8, 4))}${apiKey.slice(-4)}`
}

export function sanitizeErrorForLogging(error: any): any {
  if (!error || typeof error !== 'object') return error
  const sanitized = { ...error }
  if (sanitized.apiKey) {
    sanitized.apiKey = maskApiKey(String(sanitized.apiKey))
  }
  return sanitized
}

export function getApiKeyFromEnv(): string | null {
  const apiKey = process.env.GROQ_API_KEY?.trim()
  if (!apiKey) return null
  if (!apiKey.startsWith('gsk_')) {
    throw new Error(ApiKeyError.InvalidFormat)
  }
  return apiKey
}
