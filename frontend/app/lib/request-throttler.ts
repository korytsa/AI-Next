export class RequestThrottler {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  canMakeRequest(identifier: string): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []

    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    )

    if (recentRequests.length >= this.maxRequests) {
      return false
    }

    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)

    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    )

    return Math.max(0, this.maxRequests - recentRequests.length)
  }

  getResetTime(identifier: string): number | null {
    const now = Date.now()
    const userRequests = this.requests.get(identifier) || []
    const oldestRequest = userRequests
      .filter((timestamp) => now - timestamp < this.windowMs)
      .sort((a, b) => a - b)[0]

    if (!oldestRequest) {
      return null
    }

    return oldestRequest + this.windowMs
  }

  clear(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier)
    } else {
      this.requests.clear()
    }
  }
}
