import { NextResponse } from 'next/server'
import { CmsError, getConfigHistory } from '@/lib/cms-client'
import { getSessionToken } from '@/lib/session'

export async function GET() {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  try {
    const history = await getConfigHistory(token)
    return NextResponse.json(history)
  } catch (err) {
    if (err instanceof CmsError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[admin] history error:', err)
    return NextResponse.json({ error: 'Could not reach the CMS API.' }, { status: 502 })
  }
}
