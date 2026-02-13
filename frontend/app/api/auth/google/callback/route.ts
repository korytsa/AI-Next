import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { signToken, AUTH_COOKIE_NAME } from '@/app/lib/jwt'
import { findOrCreateUserByEmail } from '@/app/lib/db'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || req.nextUrl.searchParams.get('error')) return NextResponse.redirect(new URL('/login', req.url))

  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : req.nextUrl.origin
  const redirectUri = `${origin}/api/auth/google/callback`

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) return NextResponse.redirect(new URL('/login', req.url))

  const { id_token } = await tokenRes.json()
  const payload = jwt.decode(id_token) as { email?: string; name?: string; given_name?: string } | null
  const email = payload?.email
  if (!email) return NextResponse.redirect(new URL('/login?error=no_email', req.url))

  const user = findOrCreateUserByEmail(email, payload?.name || payload?.given_name || '')
  const state = req.nextUrl.searchParams.get('state') || '/chat'
  const redirectTo = state.startsWith('/') ? state : '/chat'
  const res = NextResponse.redirect(new URL(redirectTo, req.url))
  res.cookies.set(AUTH_COOKIE_NAME, signToken({ userId: user.id, email: user.email }), {
    path: '/',
    httpOnly: true,
    maxAge: 86400,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
