import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { updateInquiryStatus } from '@/lib/inquiries-client'
import type { InquiryStatus } from '@/lib/inquiries/types'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const { status } = (await request.json()) as { status: InquiryStatus }
    const inquiry = await updateInquiryStatus(token, id, status)
    return NextResponse.json(inquiry)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update inquiry'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
