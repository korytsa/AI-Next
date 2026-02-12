import { NextRequest, NextResponse } from 'next/server'
import { addUser, findUserByEmail } from '@/app/lib/db'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? '').trim()
    const password = String(body.password ?? '').trim()
    const nickname = String(body.nickname ?? '').trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'emailPasswordRequired' },
        { status: 400 }
      )
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'userExists' },
        { status: 400 }
      )
    }

    addUser(email, password, nickname)

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { error: 'invalidRequest' },
      { status: 400 }
    )
  }
}
