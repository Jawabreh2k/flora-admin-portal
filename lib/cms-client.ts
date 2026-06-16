import 'server-only'
import { env } from './config'
import type { AuthResponse, UiConfigPayload, UiConfigResponse } from './types'

/** Thin server-side client for the Flora CMS .NET API. */

export class CmsError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
    this.name = 'CmsError'
  }
}

function isConnectionError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const cause = err.cause as { code?: string } | undefined
  return err.message === 'fetch failed' || cause?.code === 'ECONNREFUSED'
}

export async function cmsFetch(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init)
  } catch (err) {
    if (isConnectionError(err)) {
      throw new CmsError(
        `Cannot reach the Flora CMS API at ${env.apiUrl}. Start flora-backend (dotnet run --project Flora.Cms.Api) or update FLORA_API_URL.`,
        503,
      )
    }
    throw err
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await cmsFetch(`${env.apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    cache: 'no-store',
  })

  if (res.status === 401) throw new CmsError('Invalid username or password.', 401)
  if (!res.ok) throw new CmsError(`Login failed (${res.status}).`, res.status)

  return (await res.json()) as AuthResponse
}

/** Reads the current config via the admin endpoint (requires a valid token). */
export async function getAdminConfig(token: string): Promise<UiConfigResponse> {
  const res = await cmsFetch(`${env.apiUrl}/api/admin/ui/config`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store',
  })

  if (res.status === 401 || res.status === 403) throw new CmsError('Session expired.', 401)
  if (!res.ok) throw new CmsError(`Failed to load config (${res.status}).`, res.status)

  return (await res.json()) as UiConfigResponse
}

export async function updateAdminConfig(
  token: string,
  payload: UiConfigPayload,
): Promise<UiConfigResponse> {
  const res = await cmsFetch(`${env.apiUrl}/api/admin/ui/config`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  if (res.status === 401 || res.status === 403) throw new CmsError('Session expired.', 401)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new CmsError(text || `Save failed (${res.status}).`, res.status)
  }

  return (await res.json()) as UiConfigResponse
}

/**
 * Best-effort instant cache bust of the public site. Failures are swallowed (the
 * site still picks up the change within its ISR window) but logged.
 */
export async function revalidatePublicSite(): Promise<boolean> {
  if (!env.revalidateSecret) return false
  try {
    const res = await fetch(`${env.publicSiteUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': env.revalidateSecret },
      cache: 'no-store',
    })
    return res.ok
  } catch (err) {
    console.error('[admin] Failed to revalidate public site:', err)
    return false
  }
}
