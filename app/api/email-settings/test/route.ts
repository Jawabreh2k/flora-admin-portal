import { NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/session'
import { sendTestEmail } from '@/lib/email-settings-client'

export async function POST(request: Request) {
  const token = await getSessionToken()
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { to } = (await request.json()) as { to: string }
    const result = await sendTestEmail(token, to)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send test email'
    const status = message.includes('Session expired') ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
