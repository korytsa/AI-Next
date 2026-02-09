import { useFetch, useFetchMutation } from '@/app/hooks/useFetch'
import { formatDate } from '@/app/lib/formatters'

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

export interface ErrorData {
  errors: ErrorEntry[]
  stats: {
    total: number
    byType: Record<string, number>
    byEndpoint: Record<string, number>
  }
  total: number
}

export function useErrors() {
  const { data: errorData, loading, refetch, setData: setErrorData } = useFetch<ErrorData>(
    '/api/errors',
    { refetchInterval: 5000 }
  )
  const { execute: executeClear } = useFetchMutation()

  const handleClearErrors = async () => {
    const response = await executeClear('/api/errors', { method: 'DELETE' })
    if (response?.ok) {
      refetch()
    }
  }

  return {
    errorData,
    loading,
    fetchErrors: refetch,
    handleClearErrors,
    formatDate,
  }
}
