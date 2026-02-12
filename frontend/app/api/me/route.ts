import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyToken, AUTH_COOKIE_NAME } from '@/app/lib/jwt'
import { findUserById } from '@/app/lib/db'

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
