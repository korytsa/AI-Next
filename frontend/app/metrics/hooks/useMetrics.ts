import { useState, useEffect, useCallback } from 'react'

export interface MetricsData {
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

export function useMetrics(period: 'today' | 'week' | 'month' | 'all') {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

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

  const clearMetrics = useCallback(async () => {
    try {
      const response = await fetch('/api/metrics', { method: 'DELETE' })
      if (response.ok) {
        fetchMetrics()
      }
    } catch (error) {
      console.error('Failed to clear metrics:', error)
    }
  }, [fetchMetrics])

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [fetchMetrics])

  return { metrics, loading, fetchMetrics, clearMetrics }
}
