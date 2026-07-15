import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { listAdminCompanies, createCompany } from '@/lib/companies-client'

export async function GET() {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await listAdminCompanies(token)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load companies'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const company = await createCompany(token, body)
    return NextResponse.json(company, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create company'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
