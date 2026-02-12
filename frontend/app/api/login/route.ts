import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/app/lib/db'
import { signToken, AUTH_COOKIE_NAME } from '@/app/lib/jwt'

const COOKIE_MAX_AGE = 24 * 60 * 60 // 24 hours

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email ?? '').trim().toLowerCase()
    const password = String(body.password ?? '').trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'emailPasswordRequired' },
        { status: 400 }
      )
    }

    const user = findUserByEmail(email)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'invalidCredentials' },
        { status: 401 }
      )
    }

    const token = signToken({ userId: user.id, email: user.email })

    const response = NextResponse.json({ success: true })
    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    })
    return response
  } catch {
    return NextResponse.json(
      { error: 'invalidRequest' },
      { status: 400 }
    )
  }
}
