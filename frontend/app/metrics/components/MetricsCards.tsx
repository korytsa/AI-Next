import { Activity, TrendingUp, DollarSign } from 'lucide-react'
import { MetricsData } from '../hooks/useMetrics'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface MetricsCardsProps {
  metrics: MetricsData
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const { t } = useLanguage()

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatCost = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(cost)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.totalRequests')}</span>
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-3xl font-bold">{formatNumber(metrics.totalRequests)}</div>
        <div className="text-sm text-gray-500 mt-1">
          {metrics.successfulRequests} {t('metrics.successfulRequests')}, {metrics.failedRequests} {t('metrics.failedRequests')}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.totalTokens')}</span>
          <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div className="text-3xl font-bold">{formatNumber(metrics.totalTokens)}</div>
        <div className="text-sm text-gray-500 mt-1">
          {formatNumber(metrics.totalRequestTokens)} {t('metrics.request')}, {formatNumber(metrics.totalResponseTokens)} {t('metrics.response')}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.totalCost')}</span>
          <DollarSign className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="text-3xl font-bold">{formatCost(metrics.totalCost)}</div>
        <div className="text-sm text-gray-500 mt-1">
          {t('metrics.avg')}: {formatCost(metrics.totalRequests > 0 ? metrics.totalCost / metrics.totalRequests : 0)} {t('metrics.perRequest')}
        </div>
      </div>
    </div>
  )
}
