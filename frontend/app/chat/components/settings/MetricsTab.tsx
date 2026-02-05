'use client'

import { useState, useEffect } from 'react'
import { Activity, TrendingUp, DollarSign, RefreshCw, Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function MetricsTab() {
  const { t } = useLanguage()
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/metrics?period=${period}`)
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [period])

  const handleClear = async () => {
    if (!confirm(t('metrics.clearConfirm'))) return
    try {
      const response = await fetch('/api/metrics', { method: 'DELETE' })
      if (response.ok) {
        setMetrics(null)
      }
    } catch (error) {
      console.error('Failed to clear metrics:', error)
    }
  }

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

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
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
        <div className="flex gap-2">
          {(['today', 'week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                period === p
                  ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              {t(`metrics.${p}`)}
            </button>
          ))}
        </div>
        <button
          onClick={handleClear}
          className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('metrics.clear')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">{t('metrics.totalRequests')}</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{formatNumber(metrics.totalRequests || 0)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {metrics.successfulRequests || 0} {t('metrics.successfulRequests')}, {metrics.failedRequests || 0} {t('metrics.failedRequests')}
          </div>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">{t('metrics.totalTokens')}</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{formatNumber(metrics.totalTokens || 0)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {formatNumber(metrics.totalRequestTokens || 0)} {t('metrics.request')}, {formatNumber(metrics.totalResponseTokens || 0)} {t('metrics.response')}
          </div>
        </div>

        <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">{t('metrics.totalCost')}</span>
            <DollarSign className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{formatCost(metrics.totalCost || 0)}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('metrics.avg')}: {formatCost(metrics.totalRequests > 0 ? (metrics.totalCost || 0) / metrics.totalRequests : 0)} {t('metrics.perRequest')}
          </div>
        </div>
      </div>

      {metrics.successfulRequests > 0 && (
        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">{t('metrics.responseTimeRange')}</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white/80 dark:bg-slate-900/50 rounded-xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('metrics.fastest')}</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {metrics.minLatency ?? 0}ms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('metrics.bestResponseTime')}</div>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/50 rounded-xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('metrics.average')}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">
                {metrics.avgLatency ?? 0}ms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('metrics.meanResponseTime')}</div>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/50 rounded-xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('metrics.slowest')}</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {metrics.maxLatency ?? 0}ms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('metrics.worstResponseTime')}</div>
            </div>
          </div>
        </div>
      )}

      {metrics.byModel && Object.keys(metrics.byModel).length > 0 && (
        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('metrics.byModel')}</h3>
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
        </div>
      )}

      {metrics.byEndpoint && (
        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('metrics.byEndpoint')}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white/80 dark:bg-slate-900/50 rounded-xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('metrics.chatRegular')}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{formatNumber(metrics.byEndpoint.chat || 0)}</div>
            </div>
            <div className="p-3 bg-white/80 dark:bg-slate-900/50 rounded-xl">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('metrics.stream')}</div>
              <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{formatNumber(metrics.byEndpoint.stream || 0)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
