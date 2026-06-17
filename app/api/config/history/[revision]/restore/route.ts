import { NextResponse } from 'next/server'
import { CmsError, restoreConfigRevision, revalidatePublicSite } from '@/lib/cms-client'
import { getSessionToken } from '@/lib/session'

type Params = { params: Promise<{ revision: string }> }

/**
 * POST /api/config/history/:revision/restore — rolls the live config back to a snapshot
 * via the .NET admin endpoint, then revalidates the public site (same as a normal save).
 */
export async function POST(_request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })

  const { revision } = await params
  const rev = Number(revision)
  if (!Number.isInteger(rev) || rev <= 0) {
    return NextResponse.json({ error: 'Invalid revision.' }, { status: 400 })
  }

  try {
    const result = await restoreConfigRevision(token, rev)
    const revalidated = await revalidatePublicSite()
    return NextResponse.json({ ...result, revalidated })
  } catch (err) {
    if (err instanceof CmsError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    console.error('[admin] restore error:', err)
    return NextResponse.json({ error: 'Could not reach the CMS API.' }, { status: 502 })
  }
}
