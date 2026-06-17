import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { listInquiries } from '@/lib/inquiries-client'
import { INQUIRY_STATUSES, type InquiryStatus } from '@/lib/inquiries/types'

export async function GET(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')
  const search = searchParams.get('search') ?? undefined
  const statusParam = searchParams.get('status')
  const status = INQUIRY_STATUSES.includes(statusParam as InquiryStatus)
    ? (statusParam as InquiryStatus)
    : undefined

  try {
    const data = await listInquiries(token, { page, pageSize, search, status })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load inquiries'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
