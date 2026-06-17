import 'server-only'
import { env } from '@/lib/config'
import { CmsError, cmsFetch } from '@/lib/cms-client'
import type {
  ContactInquiry,
  ContactInquirySummary,
  InquiryStatus,
  PaginatedResponse,
} from '@/lib/inquiries/types'

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

export interface InquiryListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: InquiryStatus
}

export async function listInquiries(
  token: string,
  params: InquiryListParams = {},
): Promise<PaginatedResponse<ContactInquiry>> {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.status) query.set('status', params.status)
  return adminFetch(token, `/api/admin/inquiries?${query.toString()}`)
}

export async function getInquiriesSummary(token: string): Promise<ContactInquirySummary> {
  return adminFetch(token, '/api/admin/inquiries/summary')
}

export async function updateInquiryStatus(
  token: string,
  id: string,
  status: InquiryStatus,
): Promise<ContactInquiry> {
  return adminFetch(token, `/api/admin/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}
