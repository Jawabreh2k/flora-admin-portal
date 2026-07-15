import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { listSubscribers } from '@/lib/newsletter-client'

export async function GET(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')
  const search = searchParams.get('search') ?? undefined

  try {
    const data = await listSubscribers(token, { page, pageSize, search })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load subscribers'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
