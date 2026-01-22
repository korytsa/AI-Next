import { MetricsData } from '../hooks/useMetrics'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface ResponseTimeRangeProps {
  metrics: MetricsData
}

export function ResponseTimeRange({ metrics }: ResponseTimeRangeProps) {
  const { t } = useLanguage()

  if (metrics.successfulRequests === 0) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
      <h2 className="text-xl font-bold mb-4">{t('metrics.responseTimeRange')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('metrics.fastest')}</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {metrics.minLatency ?? 0}ms
          </div>
          <div className="text-xs text-gray-500 mt-1">{t('metrics.bestResponseTime')}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('metrics.average')}</div>
          <div className="text-2xl font-bold">{metrics.avgLatency ?? 0}ms</div>
          <div className="text-xs text-gray-500 mt-1">{t('metrics.meanResponseTime')}</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('metrics.slowest')}</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {metrics.maxLatency ?? 0}ms
          </div>
          <div className="text-xs text-gray-500 mt-1">{t('metrics.worstResponseTime')}</div>
        </div>
      </div>
    </div>
  )
}
