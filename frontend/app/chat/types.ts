export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  error?: {
    message: string
    type: 'rate_limit' | 'network' | 'server' | 'unknown'
    retryable: boolean
    retryAfter?: number
  }
}
