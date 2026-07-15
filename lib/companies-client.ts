import 'server-only'
import { env } from '@/lib/config'
import { CmsError, cmsFetch } from '@/lib/cms-client'
import type { Company, UpsertCompanyInput } from '@/lib/jobs/types'

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

  return (await res.json()) as T
}

export async function listAdminCompanies(token: string): Promise<Company[]> {
  return adminFetch(token, '/api/admin/companies')
}

export async function getAdminCompany(token: string, id: string): Promise<Company> {
  return adminFetch(token, `/api/admin/companies/${id}`)
}

export async function createCompany(token: string, input: UpsertCompanyInput): Promise<Company> {
  return adminFetch(token, '/api/admin/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function updateCompany(
  token: string,
  id: string,
  input: UpsertCompanyInput,
): Promise<Company> {
  return adminFetch(token, `/api/admin/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}
