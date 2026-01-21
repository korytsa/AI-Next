import { NextRequest, NextResponse } from 'next/server'
import { metricsStore } from '@/app/lib/metrics'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = (searchParams.get('period') as 'today' | 'week' | 'month' | 'all') || 'today'

    const metrics = metricsStore.getMetrics(period)
    return NextResponse.json(metrics)
  } catch (error: any) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    metricsStore.clear()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error clearing metrics:', error)
    return NextResponse.json(
      { error: 'Failed to clear metrics' },
      { status: 500 }
    )
  }
}
