import type { PaginatedResponse } from '@/lib/jobs/types'

export type { PaginatedResponse }

export type InquiryStatus = 'NEW' | 'READ' | 'ARCHIVED'

export const INQUIRY_STATUSES: InquiryStatus[] = ['NEW', 'READ', 'ARCHIVED']

export interface ContactInquiry {
  id: string
  name: string
  email: string
  company: string | null
  subject: string
  message: string
  locale: string
  status: InquiryStatus
  createdAtUtc: string
}

export interface ContactInquirySummary {
  total: number
  unread: number
}
