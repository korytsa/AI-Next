import { NextRequest, NextResponse } from 'next/server'
import { trackError } from '@/app/lib/error-tracker'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const errorType = searchParams.get('type') || 'test'

  try {
    switch (errorType) {
      case 'validation':
        throw new Error('Validation error: Invalid input data')
      
      case 'server':
        throw new Error('Server error: Internal server failure')
      
      case 'network':
        const networkError = new TypeError('Failed to fetch')
        networkError.name = 'NetworkError'
        throw networkError
      
      case 'rate_limit':
        const rateLimitError = new Error('Rate limit exceeded')
        rateLimitError.name = 'RateLimitError'
        trackError(rateLimitError, {
          endpoint: '/api/test-error',
          method: 'GET',
          statusCode: 429,
          retryAfter: 60,
        })
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429, headers: { 'retry-after': '60' } }
        )
      
      default:
        throw new Error(`Test error: ${errorType}`)
    }
  } catch (error: any) {
    trackError(error, {
      endpoint: '/api/test-error',
      method: 'GET',
      statusCode: 500,
      errorType,
    })
    
    return NextResponse.json(
      { 
        error: error.message || 'Test error occurred',
        type: error.name || 'test',
      },
      { status: 500 }
    )
  }
}
