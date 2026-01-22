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
    const periodDays: Record<string, number> = {
      today: 1,
      week: 7,
      month: 30,
      all: Infinity,
    }
    const cutoffTime = period === 'all' ? 0 : Date.now() - periodDays[period] * 24 * 60 * 60 * 1000
    const filtered = this.entries.filter((e) => e.timestamp >= cutoffTime)
    const successful = filtered.filter((e) => e.status === 'success')

    const totalRequests = filtered.length
    const successfulRequests = successful.length
    const totalRequestTokens = successful.reduce((sum, e) => sum + e.requestTokens, 0)
    const totalResponseTokens = successful.reduce((sum, e) => sum + e.responseTokens, 0)
    const totalTokens = successful.reduce((sum, e) => sum + e.totalTokens, 0)
    const totalDuration = successful.reduce((sum, e) => sum + e.duration, 0)
    const avgLatency = successful.length > 0 ? Math.round(totalDuration / successful.length) : 0

    const durations = successful.map((e) => e.duration).filter((d) => d >= 0)
    const minLatency = durations.length > 0 ? Math.round(Math.min(...durations)) : 0
    const maxLatency = durations.length > 0 ? Math.round(Math.max(...durations)) : 0

    const latencyByModel: Record<string, number> = {}
    const countByModel: Record<string, number> = {}
    successful.forEach((entry) => {
      latencyByModel[entry.model] = (latencyByModel[entry.model] || 0) + entry.duration
      countByModel[entry.model] = (countByModel[entry.model] || 0) + 1
    })
    Object.keys(latencyByModel).forEach((model) => {
      latencyByModel[model] = Math.round(latencyByModel[model] / countByModel[model])
    })

    const tokensPerSecondByModel: Record<string, number> = {}
    const tpsCountByModel: Record<string, number> = {}
    successful.forEach((entry) => {
      if (entry.duration > 0 && entry.totalTokens > 0) {
        const tps = (entry.totalTokens / entry.duration) * 1000
        tokensPerSecondByModel[entry.model] = (tokensPerSecondByModel[entry.model] || 0) + tps
        tpsCountByModel[entry.model] = (tpsCountByModel[entry.model] || 0) + 1
      }
    })
    Object.keys(tokensPerSecondByModel).forEach((model) => {
      tokensPerSecondByModel[model] = parseFloat((tokensPerSecondByModel[model] / tpsCountByModel[model]).toFixed(2))
    })

    let totalCost = 0
    const byModel: Record<string, { requests: number; tokens: number; cost: number }> = {}
    successful.forEach((entry) => {
      const pricing = MODEL_PRICING[entry.model] || MODEL_PRICING['llama-3.1-8b-instant']
      const entryCost = (entry.requestTokens / 1_000_000) * pricing.input + (entry.responseTokens / 1_000_000) * pricing.output
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
      avgLatency,
      minLatency,
      maxLatency,
      latencyByModel,
      tokensPerSecondByModel,
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
