'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function ErrorsTab() {
  const { t } = useLanguage()
  const [errorData, setErrorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchErrors = async () => {
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
    }
    fetchErrors()
    const interval = setInterval(fetchErrors, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleClear = async () => {
    if (!confirm(t('errorsPage.clearConfirm'))) return
    try {
      const response = await fetch('/api/errors', { method: 'DELETE' })
      if (response.ok) {
        setErrorData({ errors: [], stats: { total: 0, byType: {}, byEndpoint: {} }, total: 0 })
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
      unknown: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
    }
    return colors[type] || colors.unknown
  }

  if (loading && !errorData) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!errorData || errorData.total === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        {t('errorsPage.noErrors')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('errorsPage.totalErrors')}</div>
            <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">{errorData.total}</div>
          </div>
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('errorsPage.errorTypes')}</div>
            <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">{Object.keys(errorData.stats?.byType || {}).length}</div>
          </div>
          <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('errorsPage.endpoints')}</div>
            <div className="text-xl font-semibold text-slate-700 dark:text-slate-300">{Object.keys(errorData.stats?.byEndpoint || {}).length}</div>
          </div>
        </div>
        <button
          onClick={handleClear}
          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('errorsPage.clear')}
        </button>
      </div>

      {errorData.errors && errorData.errors.length > 0 && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {errorData.errors.map((error: any) => (
            <div
              key={error.id}
              className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-lg ${getTypeColor(error.type || 'unknown')}`}>
                    {error.type || 'unknown'}
                  </span>
                  {error.endpoint && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{error.endpoint}</span>
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(error.timestamp)}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">{error.message}</p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">Stack trace</summary>
                  <pre className="mt-2 text-xs bg-slate-100/80 dark:bg-slate-900/50 p-2 rounded overflow-x-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
