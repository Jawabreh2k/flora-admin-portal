import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/config'

/**
 * Edge gate for the dashboard. This is a coarse presence check on the session
 * cookie — the real authorization happens at the .NET API (JWT signature + role).
 * It just keeps unauthenticated users out of the editor UI and bounces logged-in
 * users away from the login screen.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE)
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/dashboard') && !hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname === '/login' && hasSession) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard/overview'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
