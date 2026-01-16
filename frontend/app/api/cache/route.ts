import { NextResponse } from 'next/server'
import { responseCache } from '@/app/lib/cache'

export async function GET() {
  try {
    const stats = responseCache.getStats()
    return NextResponse.json({
      success: true,
      cache: {
        size: stats.size,
        entries: stats.entries.map((entry) => ({
          age: `${Math.round(entry.age / 1000)}s`,
          expiresIn: `${Math.round(entry.expiresIn / 1000)}s`,
        })),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get cache stats' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    responseCache.clear()
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to clear cache' },
      { status: 500 }
    )
  }
}
