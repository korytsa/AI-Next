interface MetricEntry {
  timestamp: number
  model: string
  requestTokens: number
  responseTokens: number
  totalTokens: number
  duration: number
  endpoint: 'chat' | 'stream'
  status: 'success' | 'error'
}

const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'llama-3.1-8b-instant': { input: 0.05, output: 0.05 },
  'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
}

declare global {
  var __metricsStore: MetricsStore | undefined
}

class MetricsStore {
  private entries: MetricEntry[] = []
  private readonly maxEntries = 10000

  constructor() {}

  record(entry: Omit<MetricEntry, 'timestamp'>) {
    const fullEntry: MetricEntry = {
      ...entry,
      timestamp: Date.now(),
    }

    this.entries.push(fullEntry)

    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries)
    }
  }

  getMetrics(period: 'today' | 'week' | 'month' | 'all' = 'today') {
    const now = Date.now()
    let cutoffTime = 0

    switch (period) {
      case 'today':
        cutoffTime = now - 24 * 60 * 60 * 1000 
        break
      case 'week':
        cutoffTime = now - 7 * 24 * 60 * 60 * 1000 
        break
      case 'month':
        cutoffTime = now - 30 * 24 * 60 * 60 * 1000 
        break
      case 'all':
        cutoffTime = 0
        break
    }

    const filtered = this.entries.filter((e) => e.timestamp >= cutoffTime)
    const successful = filtered.filter((e) => e.status === 'success')

    const totalRequests = filtered.length
    const successfulRequests = successful.length
    const totalRequestTokens = successful.reduce((sum, e) => sum + e.requestTokens, 0)
    const totalResponseTokens = successful.reduce((sum, e) => sum + e.responseTokens, 0)
    const totalTokens = successful.reduce((sum, e) => sum + e.totalTokens, 0)
    const totalDuration = successful.reduce((sum, e) => sum + e.duration, 0)
    const avgLatency = successful.length > 0 ? totalDuration / successful.length : 0

    let totalCost = 0
    const byModel: Record<string, { requests: number; tokens: number; cost: number }> = {}

    successful.forEach((entry) => {
      const pricing = MODEL_PRICING[entry.model] || MODEL_PRICING['llama-3.1-8b-instant']
      const inputCost = (entry.requestTokens / 1_000_000) * pricing.input
      const outputCost = (entry.responseTokens / 1_000_000) * pricing.output
      const entryCost = inputCost + outputCost
      totalCost += entryCost

      if (!byModel[entry.model]) {
        byModel[entry.model] = { requests: 0, tokens: 0, cost: 0 }
      }
      byModel[entry.model].requests += 1
      byModel[entry.model].tokens += entry.totalTokens
      byModel[entry.model].cost += entryCost
    })

    const byEndpoint = {
      chat: filtered.filter((e) => e.endpoint === 'chat').length,
      stream: filtered.filter((e) => e.endpoint === 'stream').length,
    }

    return {
      period,
      totalRequests,
      successfulRequests,
      failedRequests: totalRequests - successfulRequests,
      totalRequestTokens,
      totalResponseTokens,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(6)),
      avgLatency: Math.round(avgLatency),
      byModel,
      byEndpoint,
    }
  }

  clear() {
    this.entries = []
  }

  getEntryCount() {
    return this.entries.length
  }
}

function getMetricsStore(): MetricsStore {
  if (!global.__metricsStore) {
    global.__metricsStore = new MetricsStore()
  }
  return global.__metricsStore
}

export const metricsStore = getMetricsStore()

export function recordMetric(
  model: string,
  requestTokens: number,
  responseTokens: number,
  duration: number,
  endpoint: 'chat' | 'stream',
  status: 'success' | 'error' = 'success'
) {
  metricsStore.record({
    model,
    requestTokens,
    responseTokens,
    totalTokens: requestTokens + responseTokens,
    duration,
    endpoint,
    status,
  })
}
