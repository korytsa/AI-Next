import { NextRequest } from 'next/server'
import { RequestThrottler } from './request-throttler'

const throttler = new RequestThrottler(10, 60000)

export function checkThrottle(req: NextRequest): {
  allowed: boolean
  response?: Response
} {
  const clientId = req.headers.get('x-client-id') || req.ip || 'anonymous'

  if (!throttler.canMakeRequest(clientId)) {
    const resetTime = throttler.getResetTime(clientId)
    const remaining = throttler.getRemainingRequests(clientId)
    const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60

    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: 'Too many requests. Please wait before sending another message.',
          retryAfter,
          remaining,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      ),
    }
  }

  return { allowed: true }
}
