import { NextResponse } from 'next/server'
import { CmsError, revalidatePublicSite, updateAdminConfig } from '@/lib/cms-client'
import { getSessionToken } from '@/lib/session'
import type { UiConfigPayload } from '@/lib/types'

/**
 * PUT /api/config — forwards the edited payload to the .NET admin endpoint using
 * the JWT from the httpOnly cookie, then triggers an instant revalidation of the
 * public site. The browser never holds the token.
 */
export async function PUT(request: Request) {
  const token = await getSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  let payload: UiConfigPayload
  try {
    payload = (await request.json()) as UiConfigPayload
  } catch {
    return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
  }

  try {
    const result = await updateAdminConfig(token, payload)
    const revalidated = await revalidatePublicSite()
    return NextResponse.json({ ...result, revalidated })
  } catch (err) {
    if (err instanceof CmsError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[admin] save error:', err)
    return NextResponse.json({ error: 'Could not reach the CMS API.' }, { status: 502 })
  }
}
