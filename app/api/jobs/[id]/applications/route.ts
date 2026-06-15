import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { listJobApplications } from '@/lib/jobs-client'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')

  try {
    const data = await listJobApplications(token, id, page, pageSize)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load applications'
    const status = message.includes('Session expired') ? 401 : 404
    return NextResponse.json({ error: message }, { status })
  }
}
