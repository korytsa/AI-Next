import { useState, useEffect, useCallback } from 'react'
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
  const [errorData, setErrorData] = useState<ErrorData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchErrors = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/errors')
      if (response.ok) {
        const data = await response.json()
        setErrorData(data)
      }
    } catch (error) {
      console.error('Failed to fetch errors:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchErrors()
    const interval = setInterval(fetchErrors, 5000)
    return () => clearInterval(interval)
  }, [fetchErrors])

  const handleClearErrors = async () => {
    try {
      const response = await fetch('/api/errors', { method: 'DELETE' })
      if (response.ok) {
        fetchErrors()
      }
    } catch (error) {
      console.error('Failed to clear errors:', error)
    }
  }

  return {
    errorData,
    loading,
    fetchErrors,
    handleClearErrors,
    formatDate,
  }
}
