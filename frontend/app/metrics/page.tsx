'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useMetrics } from './hooks/useMetrics'
import { MetricsHeader } from './components/MetricsHeader'
import { MetricsCards } from './components/MetricsCards'
import { ResponseTimeRange } from './components/ResponseTimeRange'
import { MetricsTable } from './components/MetricsTable'
import { EndpointStats } from './components/EndpointStats'

export default function MetricsPage() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')
  const { metrics, loading, fetchMetrics, clearMetrics } = useMetrics(period)

  const handleClear = async () => {
    if (!confirm(t('metrics.clearConfirm'))) {
      return
    }
    await clearMetrics()
  }

  if (loading && !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">{t('metrics.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <MetricsHeader
          period={period}
          onPeriodChange={setPeriod}
          onRefresh={fetchMetrics}
          onClear={handleClear}
        />

        {metrics && (
          <>
            <MetricsCards metrics={metrics} />
            <ResponseTimeRange metrics={metrics} />
            <MetricsTable metrics={metrics} />
            <EndpointStats metrics={metrics} />
          </>
        )}
      </div>
    </div>
  )
}
