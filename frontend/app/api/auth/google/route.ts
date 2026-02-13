import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const origin = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : req.nextUrl.origin
  const redirectUri = `${origin}/api/auth/google/callback`
  const state = req.nextUrl.searchParams.get('redirect') || '/chat'

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'openid email profile')
  url.searchParams.set('state', state)
  return NextResponse.redirect(url.toString())
}
