import 'server-only'
import { env } from '@/lib/config'
import { CmsError, cmsFetch } from '@/lib/cms-client'
import type {
  DashboardSummary,
  NewsletterSubscription,
  PaginatedResponse,
} from '@/lib/newsletter/types'

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

export interface SubscriberListParams {
  page?: number
  pageSize?: number
  search?: string
}

export async function listSubscribers(
  token: string,
  params: SubscriberListParams = {},
): Promise<PaginatedResponse<NewsletterSubscription>> {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  if (params.search?.trim()) query.set('search', params.search.trim())
  return adminFetch(token, `/api/admin/newsletter?${query.toString()}`)
}

export async function getDashboardSummary(token: string): Promise<DashboardSummary> {
  return adminFetch(token, '/api/admin/dashboard/summary')
}
