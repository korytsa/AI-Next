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
    const lastUserMessage = messages
      .filter((m) => m.role === 'user')
      .slice(-1)[0]?.content || ''

    const context = {
      message: lastUserMessage.toLowerCase().trim(),
      userName: userName || '',
      responseMode: responseMode || 'detailed',
      chainOfThought: chainOfThought || 'none',
    }

    return JSON.stringify(context)
  }

  private hashKey(key: string): string {
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  get(
    messages: any[],
    userName?: string | null,
    responseMode?: string,
    chainOfThought?: string
  ): any | null {
    const key = this.generateKey(messages, userName, responseMode, chainOfThought)
    const hash = this.hashKey(key)
    const entry = this.cache.get(hash)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(hash)
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
    const hash = this.hashKey(key)
    const now = Date.now()

    this.cache.set(hash, {
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

  getStats(): {
    size: number
    entries: Array<{ key: string; age: number; expiresIn: number }>
  } {
    const now = Date.now()
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: now - entry.timestamp,
      expiresIn: entry.expiresAt - now,
    }))

    return {
      size: this.cache.size,
      entries,
    }
  }
}

export const responseCache = new ResponseCache()

setInterval(() => {
  responseCache.cleanup()
}, 5 * 60 * 1000)
