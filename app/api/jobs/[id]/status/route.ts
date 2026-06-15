import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { updateJobStatus } from '@/lib/jobs-client'
import type { JobStatus } from '@/lib/jobs/types'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const { status } = (await request.json()) as { status: JobStatus }
    const job = await updateJobStatus(token, id, status)
    return NextResponse.json(job)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update status'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
