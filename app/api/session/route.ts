import { NextResponse } from 'next/server'
import { CmsError, login } from '@/lib/cms-client'
import { clearSessionToken, setSessionToken } from '@/lib/session'

/** POST /api/session — exchange credentials for a JWT and store it in an httpOnly cookie. */
export async function POST(request: Request) {
  let body: { username?: string; password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const username = body.username?.trim()
  const password = body.password ?? ''
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
  }

  try {
    const auth = await login(username, password)
    await setSessionToken(auth.accessToken, auth.expiresAtUtc)
    return NextResponse.json({ username: auth.username, role: auth.role })
  } catch (err) {
    if (err instanceof CmsError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[admin] login error:', err)
    return NextResponse.json({ error: 'Could not reach the CMS API.' }, { status: 502 })
  }
}

/** DELETE /api/session — log out. */
export async function DELETE() {
  await clearSessionToken()
  return NextResponse.json({ ok: true })
}
