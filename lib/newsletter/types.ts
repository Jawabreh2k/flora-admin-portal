import type { PaginatedResponse } from '@/lib/jobs/types'

export type { PaginatedResponse }

export interface NewsletterSubscription {
  id: string
  email: string
  locale: string
  createdAtUtc: string
}

/** Mirrors DashboardSummaryDto served by GET /api/admin/dashboard/summary. */
export interface DashboardSummary {
  jobs: { published: number; draft: number; archived: number }
  applications: { total: number; awaitingReview: number; lastSevenDays: number }
  inquiries: { total: number; unread: number }
  newsletter: { total: number; lastThirtyDays: number }
  topJobs: {
    jobId: string
    title: string
    department: string
    applicationCount: number
  }[]
}
