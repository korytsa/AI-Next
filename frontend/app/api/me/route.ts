import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE_NAME } from '@/app/lib/jwt'
import { findUserById, updateUserNickname } from '@/app/lib/db'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ loggedIn: false })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ loggedIn: false })
  }

  const user = findUserById(payload.userId)

  return NextResponse.json({
    loggedIn: true,
    email: payload.email,
    nickname: user?.nickname ?? '',
  })
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value

  if (!token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const nickname = String(body.nickname ?? '').trim()

    if (!nickname) {
      return NextResponse.json(
        { error: 'Nickname is required' },
        { status: 400 }
      )
    }

    updateUserNickname(payload.userId, nickname)

    return NextResponse.json({ nickname })
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
