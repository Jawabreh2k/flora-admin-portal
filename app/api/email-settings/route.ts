import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { getEmailSettings, updateEmailSettings } from '@/lib/email-settings-client'
import type { UpdateEmailSettingsInput } from '@/lib/email-settings/types'

export async function GET() {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await getEmailSettings(token)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load email settings'
    const status = message.includes('Session expired') ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

export async function PUT(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = (await request.json()) as UpdateEmailSettingsInput
    const data = await updateEmailSettings(token, body)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save email settings'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
