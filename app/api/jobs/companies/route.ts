import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { listCompanies } from '@/lib/jobs-client'

export async function GET() {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const companies = await listCompanies(token)
    return NextResponse.json(companies)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load companies'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
