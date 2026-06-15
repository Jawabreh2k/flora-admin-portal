import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { updateApplicationStatus } from '@/lib/jobs-client'
import type { ApplicationStatus } from '@/lib/jobs/types'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const { status } = (await request.json()) as { status: ApplicationStatus }
    const application = await updateApplicationStatus(token, id, status)
    return NextResponse.json(application)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update application'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
