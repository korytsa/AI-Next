'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ErrorEntry {
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

interface ErrorData {
  errors: ErrorEntry[]
  stats: {
    total: number
    byType: Record<string, number>
    byEndpoint: Record<string, number>
  }
  total: number
}

export default function ErrorsPage() {
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
    if (!confirm('Are you sure you want to clear all errors? This action cannot be undone.')) {
      return
    }

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

  if (loading && !errorData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading errors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                <h1 className="text-3xl font-bold">Error Tracking</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchErrors}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleClearErrors}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>

          {errorData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Errors</div>
                <div className="text-2xl font-bold">{errorData.total}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Error Types</div>
                <div className="text-2xl font-bold">{Object.keys(errorData.stats.byType).length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Endpoints</div>
                <div className="text-2xl font-bold">{Object.keys(errorData.stats.byEndpoint).length}</div>
              </div>
            </div>
          )}

        </div>

        {errorData && errorData.errors.length > 0 ? (
          <div className="space-y-4">
            {errorData.errors.map((error) => (
              <div
                key={error.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border-l-4 border-red-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(error.type)}`}>
                        {error.type}
                      </span>
                      {error.statusCode && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                          {error.statusCode}
                        </span>
                      )}
                      {error.endpoint && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                          {error.method} {error.endpoint}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {error.message}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(error.timestamp)}
                    </p>
                  </div>
                </div>

                {error.stack && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                      Stack trace
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                      {error.stack}
                    </pre>
                  </details>
                )}

                {error.context && Object.keys(error.context).length > 0 && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                      Context
                    </summary>
                    <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                      {JSON.stringify(error.context, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No errors found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              All clear! No errors have been recorded.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
