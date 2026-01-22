import { MetricsData } from '../hooks/useMetrics'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface MetricsTableProps {
  metrics: MetricsData
}

export function MetricsTable({ metrics }: MetricsTableProps) {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow mb-8">
      <h2 className="text-xl font-bold mb-4">{t('metrics.byModel')}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.model')}</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.requests')}</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.tokens')}</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.cost')}</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.avgLatency')}</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">{t('metrics.tokensPerSec')}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metrics.byModel).map(([model, data]) => (
              <tr key={model} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-3 px-4 text-sm">{model}</td>
                <td className="py-3 px-4 text-sm text-right">{formatNumber(data.requests)}</td>
                <td className="py-3 px-4 text-sm text-right">{formatNumber(data.tokens)}</td>
                <td className="py-3 px-4 text-sm text-right">{formatCost(data.cost)}</td>
                <td className="py-3 px-4 text-sm text-right font-medium">
                  {metrics.latencyByModel?.[model] ? `${metrics.latencyByModel[model]}ms` : 'N/A'}
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium">
                  {metrics.tokensPerSecondByModel?.[model] ? `${metrics.tokensPerSecondByModel[model]}` : 'N/A'}
                </td>
              </tr>
            ))}
            {Object.keys(metrics.byModel).length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">
                  {t('metrics.noData')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
