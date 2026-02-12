import jwt from 'jsonwebtoken'

export const AUTH_COOKIE_NAME = 'auth_token'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const EXPIRES_IN = '24h'

export interface JwtPayload {
  userId: string
  email: string
  sub: string
  iat?: number
  exp?: number
}

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(
    {
      userId: payload.userId,
      email: payload.email,
      sub: payload.userId,
    },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  )
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch {
    return null
  }
}
