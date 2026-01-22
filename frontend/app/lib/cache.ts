interface CacheEntry {
  response: any
  timestamp: number
  expiresAt: number
}

class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map()
  private defaultTTL: number = 60 * 60 * 1000

  private generateKey(
    messages: any[],
    userName?: string | null,
    responseMode?: string,
    chainOfThought?: string
  ): string {
    const lastUserMessage = messages.findLast((m) => m.role === 'user')?.content || ''
    return JSON.stringify({
      message: lastUserMessage.toLowerCase().trim(),
      userName: userName || '',
      responseMode: responseMode || 'detailed',
      chainOfThought: chainOfThought || 'none',
    })
  }

  get(
    messages: any[],
    userName?: string | null,
    responseMode?: string,
    chainOfThought?: string
  ): any | null {
    const key = this.generateKey(messages, userName, responseMode, chainOfThought)
    const entry = this.cache.get(key)

    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) this.cache.delete(key)
      return null
    }

    return entry.response
  }

  set(
    messages: any[],
    response: any,
    userName?: string | null,
    responseMode?: string,
    chainOfThought?: string,
    ttl?: number
  ): void {
    const key = this.generateKey(messages, userName, responseMode, chainOfThought)
    const now = Date.now()
    this.cache.set(key, {
      response,
      timestamp: now,
      expiresAt: now + (ttl || this.defaultTTL),
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key)
      }
    }
  }

  getStats() {
    const now = Date.now()
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: now - entry.timestamp,
        expiresIn: entry.expiresAt - now,
      })),
    }
  }
}

export const responseCache = new ResponseCache()

setInterval(() => {
  responseCache.cleanup()
}, 5 * 60 * 1000)
