import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { getInquiriesSummary } from '@/lib/inquiries-client'

export async function GET() {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getInquiriesSummary(token)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load summary'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
