import { NextRequest, NextResponse } from 'next/server'
import { errorStore } from '@/app/lib/error-tracker'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const type = searchParams.get('type')

    let errors
    if (type) {
      errors = errorStore.getErrorsByType(type)
    } else {
      errors = errorStore.getErrors(limit)
    }

    const stats = errorStore.getErrorStats()

    return NextResponse.json({
      errors,
      stats,
      total: errorStore.getErrorCount(),
    })
  } catch (error: any) {
    console.error('Error fetching errors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch errors' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    errorStore.clear()
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error clearing errors:', error)
    return NextResponse.json(
      { error: 'Failed to clear errors' },
      { status: 500 }
    )
  }
}
