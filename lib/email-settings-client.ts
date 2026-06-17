import 'server-only'
import { env } from '@/lib/config'
import { CmsError, cmsFetch } from '@/lib/cms-client'
import type {
  EmailSettings,
  TestEmailResult,
  UpdateEmailSettingsInput,
} from '@/lib/email-settings/types'

/** Authenticated passthrough to the .NET admin API (Backend-for-Frontend). */
async function adminFetch<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const res = await cmsFetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (res.status === 401 || res.status === 403) throw new CmsError('Session expired.', 401)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new CmsError(text || `Request failed (${res.status}).`, res.status)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export async function getEmailSettings(token: string): Promise<EmailSettings> {
  return adminFetch(token, '/api/admin/email-settings')
}

export async function updateEmailSettings(
  token: string,
  input: UpdateEmailSettingsInput,
): Promise<EmailSettings> {
  return adminFetch(token, '/api/admin/email-settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function sendTestEmail(token: string, to: string): Promise<TestEmailResult> {
  return adminFetch(token, '/api/admin/email-settings/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to }),
  })
}
