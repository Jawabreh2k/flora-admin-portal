import 'server-only'
import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './config'

/**
 * Session is stored as the raw JWT inside an httpOnly, SameSite=Lax cookie. The
 * token therefore never touches client-side JavaScript (mitigates XSS token theft),
 * and the browser never calls the .NET API directly — all admin traffic flows
 * through this portal's route handlers (a Backend-for-Frontend).
 */

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value ?? null
}

export async function setSessionToken(token: string, expiresAtUtc: string): Promise<void> {
  const store = await cookies()
  const expires = new Date(expiresAtUtc)
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: Number.isNaN(expires.getTime()) ? undefined : expires,
  })
}

export async function clearSessionToken(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
