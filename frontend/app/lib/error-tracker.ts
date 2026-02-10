export interface ErrorEntry {
  id: string
  timestamp: number
  message: string
  type: string
  stack?: string
  endpoint?: string
  method?: string
  statusCode?: number
  userAgent?: string
  url?: string
  context?: Record<string, any>
}

declare global {
  var __errorStore: ErrorStore | undefined
}

class ErrorStore {
  private errors: ErrorEntry[] = []
  private readonly maxErrors = 1000

  record(error: Omit<ErrorEntry, 'id' | 'timestamp'>) {
    const fullEntry: ErrorEntry = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    this.errors.push(fullEntry)

    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }
  }

  getErrors(limit: number = 100) {
    return this.errors
      .slice()
      .reverse()
      .slice(0, limit)
  }

  getErrorsByType(type: string) {
    return this.errors.filter((e) => e.type === type)
  }

  getErrorStats() {
    const total = this.errors.length
    const byType: Record<string, number> = {}
    const byEndpoint: Record<string, number> = {}

    this.errors.forEach((error) => {
      byType[error.type] = (byType[error.type] || 0) + 1
      if (error.endpoint) {
        byEndpoint[error.endpoint] = (byEndpoint[error.endpoint] || 0) + 1
      }
    })

    return {
      total,
      byType,
      byEndpoint,
    }
  }

  clear() {
    this.errors = []
  }

  getErrorCount() {
    return this.errors.length
  }
}

function getErrorStore(): ErrorStore {
  if (!global.__errorStore) {
    global.__errorStore = new ErrorStore()
  }
  return global.__errorStore
}

export const errorStore = getErrorStore()

export function trackError(
  error: Error | any,
  context?: {
    endpoint?: string
    method?: string
    statusCode?: number
    userAgent?: string
    url?: string
    [key: string]: any
  }
) {
  const message = error?.message || String(error) || 'Unknown error'
  const stack = error?.stack
  const explicitType = typeof context?.type === 'string' ? String(context.type) : undefined
  const type = explicitType || error?.name || error?.type || 'unknown'

  const contextFields =
    context && Object.keys(context).length > 0
      ? Object.fromEntries(
          Object.entries(context).filter(
            ([key]) =>
              !['endpoint', 'method', 'statusCode', 'userAgent', 'url'].includes(key)
          )
        )
      : undefined

  errorStore.record({
    message,
    type,
    stack,
    endpoint: context?.endpoint,
    method: context?.method,
    statusCode: context?.statusCode,
    userAgent: context?.userAgent,
    url: context?.url,
    context: contextFields,
  })
}
