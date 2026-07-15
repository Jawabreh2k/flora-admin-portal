export type LocationType = 'REMOTE' | 'HYBRID' | 'ONSITE'
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN'
export type JobStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type ApplicationStatus =
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEWING'
  | 'OFFERED'
  | 'REJECTED'

export interface CompanySummary {
  id: string
  name: string
  logoUrl: string | null
  website: string | null
}

export interface Company extends CompanySummary {
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
}

export interface JobListItem {
  id: string
  title: string
  titleAr: string | null
  department: string
  locationType: LocationType
  locationText: string
  jobType: JobType
  salaryRange: string | null
  closingDate: string | null
  createdAt: string
  company: CompanySummary
}

export interface JobDetail {
  id: string
  title: string
  titleAr: string | null
  department: string
  locationType: LocationType
  locationText: string
  jobType: JobType
  description: string
  descriptionAr: string | null
  requirements: string[]
  requirementsAr: string[]
  responsibilities: string[]
  responsibilitiesAr: string[]
  salaryRange: string | null
  status: JobStatus
  closingDate: string | null
  createdAt: string
  updatedAt: string
  company: Company
}

export interface AdminJobListItem {
  id: string
  title: string
  titleAr: string | null
  department: string
  status: JobStatus
  locationType: LocationType
  jobType: JobType
  createdAt: string
  updatedAt: string
  applicationCount: number
  company: CompanySummary
}

export interface Application {
  id: string
  jobPostingId: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string | null
  resumeUrl: string
  coverLetter: string | null
  status: ApplicationStatus
  appliedAt: string
}

export interface UpsertCompanyInput {
  name: string
  logoUrl?: string | null
  website?: string | null
  description?: string | null
}

export interface UpsertJobInput {
  companyId: string
  title: string
  titleAr?: string | null
  department: string
  locationType: LocationType
  locationText: string
  jobType: JobType
  description: string
  descriptionAr?: string | null
  requirements: string[]
  requirementsAr: string[]
  responsibilities: string[]
  responsibilitiesAr: string[]
  salaryRange?: string | null
  status: JobStatus
  closingDate?: string | null
}

export const LOCATION_TYPES: LocationType[] = ['REMOTE', 'HYBRID', 'ONSITE']
export const JOB_TYPES: JobType[] = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN']
export const JOB_STATUSES: JobStatus[] = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'APPLIED',
  'SCREENING',
  'INTERVIEWING',
  'OFFERED',
  'REJECTED',
]

export function formatEnumLabel(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
