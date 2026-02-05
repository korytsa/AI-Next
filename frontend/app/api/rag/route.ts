import { NextResponse } from 'next/server'
import { MOCK_DOCUMENTS } from '@/app/lib/rag-data'

export async function GET() {
  try {
    return NextResponse.json({
      documents: MOCK_DOCUMENTS,
      count: MOCK_DOCUMENTS.length,
      mock: true,
    })
  } catch (error: any) {
    console.error('Error getting documents:', error)
    return NextResponse.json(
      { error: 'Failed to get documents', details: error.message },
      { status: 500 }
    )
  }
}

