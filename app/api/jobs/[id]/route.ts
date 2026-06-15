import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { getAdminJob, updateJob } from '@/lib/jobs-client'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const job = await getAdminJob(token, id)
    return NextResponse.json(job)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load job'
    const status = message.includes('Session expired') ? 401 : 404
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const body = await request.json()
    const job = await updateJob(token, id, body)
    return NextResponse.json(job)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update job'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
