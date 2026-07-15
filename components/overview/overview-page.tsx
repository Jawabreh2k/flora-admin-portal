'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Briefcase, Inbox, Loader2, MailPlus, Users } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardSummary } from '@/lib/newsletter/types'

async function fetchSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary')
  if (!res.ok) throw new Error('Failed to load dashboard summary')
  return res.json()
}

function StatTile({
  label,
  value,
  detail,
  icon: Icon,
  href,
}: {
  label: string
  value: number
  detail: string
  icon: typeof Briefcase
  href: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border bg-surface p-5 transition-all hover:border-brand/40 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-surface-sunken text-muted transition-colors group-hover:bg-brand-muted group-hover:text-brand">
          <Icon className="size-4" />
        </span>
        <ArrowRight className="size-4 text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="mt-4 text-3xl font-semibold tabular-nums tracking-tight text-foreground">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{detail}</p>
    </Link>
  )
}

export function OverviewPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard-summary'],
    queryFn: fetchSummary,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  return (
    <div>
      <PageHeader
        title="Overview"
        description="How the public site is performing — roles, applications, inquiries and newsletter signups."
      />

      {isError && (
        <Alert variant="warning">Could not load the dashboard summary. Is the CMS API running?</Alert>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 py-12 text-sm text-muted">
          <Loader2 className="size-4 animate-spin" />
          Loading overview…
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Open positions"
              value={data.jobs.published}
              detail={`${data.jobs.draft} draft · ${data.jobs.archived} archived`}
              icon={Briefcase}
              href="/dashboard/jobs"
            />
            <StatTile
              label="Applications"
              value={data.applications.total}
              detail={`${data.applications.awaitingReview} awaiting review · ${data.applications.lastSevenDays} in the last 7 days`}
              icon={Users}
              href="/dashboard/jobs"
            />
            <StatTile
              label="Contact inquiries"
              value={data.inquiries.total}
              detail={`${data.inquiries.unread} unread`}
              icon={Inbox}
              href="/dashboard/inquiries"
            />
            <StatTile
              label="Newsletter subscribers"
              value={data.newsletter.total}
              detail={`${data.newsletter.lastThirtyDays} in the last 30 days`}
              icon={MailPlus}
              href="/dashboard/subscribers"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Applications by role</CardTitle>
              <CardDescription>
                Published positions ranked by application volume — zero-application roles may
                need a better description or wider promotion.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.topJobs.length === 0 ? (
                <p className="py-6 text-sm text-muted">
                  No published positions yet.{' '}
                  <Link href="/dashboard/jobs/new" className="font-medium text-brand hover:underline">
                    Post the first role
                  </Link>
                  .
                </p>
              ) : (
                <ul className="divide-y divide-border">
                  {data.topJobs.map((job) => (
                    <li key={job.jobId}>
                      <Link
                        href={`/dashboard/jobs/${job.jobId}/applications`}
                        className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-surface-sunken/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{job.title}</p>
                          <p className="text-xs text-muted">{job.department}</p>
                        </div>
                        <p className="shrink-0 text-sm tabular-nums text-foreground">
                          {job.applicationCount.toLocaleString()}{' '}
                          <span className="text-muted">
                            {job.applicationCount === 1 ? 'application' : 'applications'}
                          </span>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
