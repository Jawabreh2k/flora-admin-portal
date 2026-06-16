import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { createJob, listAdminJobs } from '@/lib/jobs-client'
import { JOB_STATUSES, type JobStatus } from '@/lib/jobs/types'

export async function GET(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')
  const search = searchParams.get('search') ?? undefined
  const statusParam = searchParams.get('status')
  const status = JOB_STATUSES.includes(statusParam as JobStatus)
    ? (statusParam as JobStatus)
    : undefined

  try {
    const data = await listAdminJobs(token, { page, pageSize, search, status })
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load jobs'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const job = await createJob(token, body)
    return NextResponse.json(job, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create job'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
