import 'server-only'
import { env } from '@/lib/config'
import { CmsError, cmsFetch } from '@/lib/cms-client'
import type {
  AdminJobListItem,
  Application,
  Company,
  JobDetail,
  PaginatedResponse,
  UpsertJobInput,
  ApplicationStatus,
  JobStatus,
} from '@/lib/jobs/types'

async function adminFetch<T>(
  token: string,
  path: string,
  init?: RequestInit,
): Promise<T> {
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

export interface AdminJobListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: JobStatus
}

export async function listAdminJobs(
  token: string,
  params: AdminJobListParams = {},
): Promise<PaginatedResponse<AdminJobListItem>> {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.status) query.set('status', params.status)
  return adminFetch(token, `/api/admin/jobs?${query.toString()}`)
}

export async function getAdminJob(token: string, id: string): Promise<JobDetail> {
  return adminFetch(token, `/api/admin/jobs/${id}`)
}

export async function listCompanies(token: string): Promise<Company[]> {
  return adminFetch(token, '/api/admin/jobs/companies')
}

export async function createJob(token: string, input: UpsertJobInput): Promise<JobDetail> {
  return adminFetch(token, '/api/admin/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function updateJob(
  token: string,
  id: string,
  input: UpsertJobInput,
): Promise<JobDetail> {
  return adminFetch(token, `/api/admin/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export async function updateJobStatus(
  token: string,
  id: string,
  status: JobStatus,
): Promise<JobDetail> {
  return adminFetch(token, `/api/admin/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export interface ApplicationListParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
}

export async function listJobApplications(
  token: string,
  jobId: string,
  params: ApplicationListParams = {},
): Promise<PaginatedResponse<Application>> {
  const query = new URLSearchParams()
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  if (params.search?.trim()) query.set('search', params.search.trim())
  if (params.status) query.set('status', params.status)
  return adminFetch(token, `/api/admin/jobs/${jobId}/applications?${query.toString()}`)
}

export async function updateApplicationStatus(
  token: string,
  applicationId: string,
  status: ApplicationStatus,
): Promise<Application> {
  return adminFetch(token, `/api/admin/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}
