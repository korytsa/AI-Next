import { NextRequest } from 'next/server'
import { RequestThrottler } from './request-throttler'
import { ErrorMessage, ApiString } from './app-strings'

const throttler = new RequestThrottler(10, 60000)

export function checkThrottle(req: NextRequest): {
  allowed: boolean
  response?: Response
} {
  const clientId = req.headers.get(ApiString.HeaderXClientId) || req.ip || ApiString.AnonymousClientId

  if (!throttler.canMakeRequest(clientId)) {
    const resetTime = throttler.getResetTime(clientId)
    const remaining = throttler.getRemainingRequests(clientId)
    const retryAfter = resetTime ? Math.ceil((resetTime - Date.now()) / 1000) : 60

    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: ErrorMessage.RateLimitThrottle,
          retryAfter,
          remaining,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': ApiString.ContentTypeJson,
            [ApiString.HeaderRetryAfter]: retryAfter.toString(),
            [ApiString.HeaderXRateLimitLimit]: '10',
            [ApiString.HeaderXRateLimitRemaining]: remaining.toString(),
          },
        }
      ),
    }
  }

  return { allowed: true }
}
