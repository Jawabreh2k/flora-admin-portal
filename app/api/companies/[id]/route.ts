import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { getAdminCompany, updateCompany } from '@/lib/companies-client'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  try {
    const company = await getAdminCompany(token, id)
    return NextResponse.json(company)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load company'
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
    const company = await updateCompany(token, id, body)
    return NextResponse.json(company)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update company'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
