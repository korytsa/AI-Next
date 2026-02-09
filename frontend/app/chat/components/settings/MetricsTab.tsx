'use client'

import { useState } from 'react'
import { Activity, TrendingUp, DollarSign, Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useFetch, useFetchMutation } from '@/app/hooks/useFetch'
import { Button } from '@/app/components/Button'
import { Card } from '@/app/components/Card'
import { Heading } from '@/app/components/Heading'
import { Loading } from '@/app/components/Loading'
import { StatCard } from '@/app/components/StatCard'
import { ToggleButtonGroup } from '@/app/components/ToggleButtonGroup'
import { formatNumber, formatCost } from '@/app/lib/formatters'

export function MetricsTab() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')
  const { data: metrics, loading, setData: setMetrics } = useFetch<any>(
    `/api/metrics?period=${period}`,
    { refetchInterval: 5000 }
  )
  const { execute: executeClear } = useFetchMutation()

  const handleClear = async () => {
    if (!confirm(t('metrics.clearConfirm'))) return
    const response = await executeClear('/api/metrics', { method: 'DELETE' })
    if (response?.ok) {
      setMetrics(null)
    }
  }

  if (loading && !metrics) {
    return <Loading variant="spinner" layout="center" />
  }

  if (!metrics) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        {t('metrics.noData')}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <ToggleButtonGroup<'today' | 'week' | 'month' | 'all'>
          value={period}
          onChange={setPeriod}
          options={[
            { value: 'today', label: t('metrics.today') },
            { value: 'week', label: t('metrics.week') },
            { value: 'month', label: t('metrics.month') },
            { value: 'all', label: t('metrics.all') },
          ]}
          size="sm"
          buttonClassName="rounded-xl"
        />
        <Button variant="danger" size="sm" onClick={handleClear} className="rounded-xl">
          <Trash2 className="w-4 h-4" />
          {t('metrics.clear')}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label={t('metrics.totalRequests')}
          value={formatNumber(metrics.totalRequests || 0)}
          size="lg"
          icon={Activity}
          iconClassName="text-indigo-500"
          subtitle={`${metrics.successfulRequests || 0} ${t('metrics.successfulRequests')}, ${metrics.failedRequests || 0} ${t('metrics.failedRequests')}`}
        />
        <StatCard
          label={t('metrics.totalTokens')}
          value={formatNumber(metrics.totalTokens || 0)}
          size="lg"
          icon={TrendingUp}
          iconClassName="text-green-500"
          subtitle={`${formatNumber(metrics.totalRequestTokens || 0)} ${t('metrics.request')}, ${formatNumber(metrics.totalResponseTokens || 0)} ${t('metrics.response')}`}
        />
        <StatCard
          label={t('metrics.totalCost')}
          value={formatCost(metrics.totalCost || 0)}
          size="lg"
          icon={DollarSign}
          iconClassName="text-yellow-500"
          subtitle={`${t('metrics.avg')}: ${formatCost(metrics.totalRequests > 0 ? (metrics.totalCost || 0) / metrics.totalRequests : 0)} ${t('metrics.perRequest')}`}
        />
      </div>

      {metrics.successfulRequests > 0 && (
        <Card>
          <Heading as="h3" size="sm" weight="semibold" className="mb-4">{t('metrics.responseTimeRange')}</Heading>
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label={t('metrics.fastest')}
              value={`${metrics.minLatency ?? 0}ms`}
              size="md"
              subtitle={t('metrics.bestResponseTime')}
              valueClassName="text-green-600 dark:text-green-400 font-bold"
            />
            <StatCard
              label={t('metrics.average')}
              value={`${metrics.avgLatency ?? 0}ms`}
              size="md"
              subtitle={t('metrics.meanResponseTime')}
            />
            <StatCard
              label={t('metrics.slowest')}
              value={`${metrics.maxLatency ?? 0}ms`}
              size="md"
              subtitle={t('metrics.worstResponseTime')}
              valueClassName="text-red-600 dark:text-red-400 font-bold"
            />
          </div>
        </Card>
      )}

      {metrics.byModel && Object.keys(metrics.byModel).length > 0 && (
        <Card>
          <Heading as="h3" size="sm" weight="semibold" className="mb-3">{t('metrics.byModel')}</Heading>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200/50 dark:border-slate-700/50">
                  <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.model')}</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.requests')}</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.tokens')}</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.cost')}</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.avgLatency')}</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">{t('metrics.tokensPerSec')}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(metrics.byModel).map(([model, data]: [string, any]) => (
                  <tr key={model} className="border-b border-slate-200/30 dark:border-slate-700/30">
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{model}</td>
                    <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{formatNumber(data.requests || 0)}</td>
                    <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{formatNumber(data.tokens || 0)}</td>
                    <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">{formatCost(data.cost || 0)}</td>
                    <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">
                      {metrics.latencyByModel?.[model] ? `${metrics.latencyByModel[model]}ms` : 'N/A'}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-700 dark:text-slate-300">
                      {metrics.tokensPerSecondByModel?.[model] ? `${metrics.tokensPerSecondByModel[model]}` : 'N/A'}
                    </td>
                  </tr>
                ))}
                {Object.keys(metrics.byModel).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      {t('metrics.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {metrics.byEndpoint && (
        <Card>
          <Heading as="h3" size="sm" weight="semibold" className="mb-3">{t('metrics.byEndpoint')}</Heading>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label={t('metrics.chatRegular')}
              value={formatNumber(metrics.byEndpoint.chat || 0)}
              size="md"
            />
            <StatCard
              label={t('metrics.stream')}
              value={formatNumber(metrics.byEndpoint.stream || 0)}
              size="md"
            />
          </div>
        </Card>
      )}
    </div>
  )
}
