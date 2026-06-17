import { cn } from '@/lib/utils'
import { formatEnumLabel, type ApplicationStatus, type JobStatus } from '@/lib/jobs/types'
import type { InquiryStatus } from '@/lib/inquiries/types'

const jobStatusStyles: Record<JobStatus, string> = {
  DRAFT: 'bg-surface-sunken text-muted ring-1 ring-border',
  PUBLISHED: 'bg-success-bg text-success ring-1 ring-emerald-200',
  ARCHIVED: 'bg-warning-bg text-warning ring-1 ring-amber-200',
}

const applicationStatusStyles: Record<ApplicationStatus, string> = {
  APPLIED: 'bg-info-bg text-info ring-1 ring-blue-200',
  SCREENING: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  INTERVIEWING: 'bg-warning-bg text-warning ring-1 ring-amber-200',
  OFFERED: 'bg-success-bg text-success ring-1 ring-emerald-200',
  REJECTED: 'bg-danger-bg text-danger ring-1 ring-red-200',
}

const inquiryStatusStyles: Record<InquiryStatus, string> = {
  NEW: 'bg-info-bg text-info ring-1 ring-blue-200',
  READ: 'bg-surface-sunken text-muted ring-1 ring-border',
  ARCHIVED: 'bg-warning-bg text-warning ring-1 ring-amber-200',
}

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        className,
      )}
      {...props}
    />
  )
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge className={jobStatusStyles[status]}>{formatEnumLabel(status)}</Badge>
  )
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge className={applicationStatusStyles[status]}>{formatEnumLabel(status)}</Badge>
  )
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <Badge className={inquiryStatusStyles[status]}>{formatEnumLabel(status)}</Badge>
  )
}
