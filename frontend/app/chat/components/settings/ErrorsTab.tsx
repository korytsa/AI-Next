'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { Button } from '@/app/components/Button'
import { Card } from '@/app/components/Card'
import { Badge } from '@/app/components/Badge'
import { Loading } from '@/app/components/Loading'
import { StatCard } from '@/app/components/StatCard'
import { formatDate } from '@/app/lib/formatters'

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

  if (loading && !errorData) {
    return <Loading variant="spinner" layout="center" />
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
          <StatCard
            label={t('errorsPage.totalErrors')}
            value={errorData.total}
            size="md"
            rounded="xl"
          />
          <StatCard
            label={t('errorsPage.errorTypes')}
            value={Object.keys(errorData.stats?.byType || {}).length}
            size="md"
            rounded="xl"
          />
          <StatCard
            label={t('errorsPage.endpoints')}
            value={Object.keys(errorData.stats?.byEndpoint || {}).length}
            size="md"
            rounded="xl"
          />
        </div>
        <Button variant="danger" size="md" onClick={handleClear} className="rounded-xl">
          <Trash2 className="w-4 h-4" />
          {t('errorsPage.clear')}
        </Button>
      </div>

      {errorData.errors && errorData.errors.length > 0 && (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {errorData.errors.map((error: any) => (
            <Card
              key={error.id}
              variant="bordered"
              rounded="xl"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={error.type || 'unknown'} rounded="lg">
                    {error.type || 'unknown'}
                  </Badge>
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
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
