import 'server-only'
import { env } from '@/lib/config'
import { CmsError } from '@/lib/cms-client'
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
  const res = await fetch(`${env.apiUrl}${path}`, {
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

export async function listAdminJobs(
  token: string,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<AdminJobListItem>> {
  return adminFetch(token, `/api/admin/jobs?page=${page}&pageSize=${pageSize}`)
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

export async function listJobApplications(
  token: string,
  jobId: string,
  page = 1,
  pageSize = 20,
): Promise<PaginatedResponse<Application>> {
  return adminFetch(
    token,
    `/api/admin/jobs/${jobId}/applications?page=${page}&pageSize=${pageSize}`,
  )
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
