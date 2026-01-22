'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, RefreshCw, Trash2, TrendingUp, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

interface MetricsData {
  period: string
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalRequestTokens: number
  totalResponseTokens: number
  totalTokens: number
  totalCost: number
  avgLatency: number
  minLatency: number
  maxLatency: number
  latencyByModel: Record<string, number>
  tokensPerSecondByModel: Record<string, number>
  byModel: Record<string, { requests: number; tokens: number; cost: number }>
  byEndpoint: { chat: number; stream: number }
}

export default function MetricsPage() {
  const { t } = useLanguage()
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today')

  const fetchMetrics = useCallback(async () => {
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
  }, [period])

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [fetchMetrics])

  const handleClearMetrics = async () => {
    if (!confirm(t('metrics.clearConfirm'))) {
      return
    }

    try {
      const response = await fetch('/api/metrics', { method: 'DELETE' })
      if (response.ok) {
        fetchMetrics()
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
                <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold">{t('metrics.title')}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchMetrics}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t('metrics.refresh')}
              </button>
              <button
                onClick={handleClearMetrics}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t('metrics.clear')}
              </button>
              <LanguageSwitcher />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.period')}:</span>
            {(['today', 'week', 'month', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {t(`metrics.${p}`)}
              </button>
            ))}
          </div>
        </div>

        {metrics && (
          <>
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

            {metrics.successfulRequests > 0 && (
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
            )}

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
                          {metrics.latencyByModel && metrics.latencyByModel[model] 
                            ? `${metrics.latencyByModel[model]}ms` 
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-medium">
                          {metrics.tokensPerSecondByModel && metrics.tokensPerSecondByModel[model] 
                            ? `${metrics.tokensPerSecondByModel[model]}` 
                            : 'N/A'}
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

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h2 className="text-xl font-bold mb-4">{t('metrics.byEndpoint')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('metrics.chatRegular')}</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.byEndpoint.chat)}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('metrics.stream')}</div>
                  <div className="text-2xl font-bold">{formatNumber(metrics.byEndpoint.stream)}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
