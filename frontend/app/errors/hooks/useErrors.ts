import { useState, useEffect, useCallback } from 'react'

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      rate_limit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      network: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      server: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      validation_error: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      moderation_error: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }
    return colors[type] || colors.unknown
  }

  return {
    errorData,
    loading,
    fetchErrors,
    handleClearErrors,
    formatDate,
    getTypeColor,
  }
}
