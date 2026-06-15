'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { ApplicationsTable } from '@/components/jobs/applications-table'
import type { JobDetail } from '@/lib/jobs/types'

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const [jobId, setJobId] = useState<string | null>(null)
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => setJobId(id))
  }, [params])

  useEffect(() => {
    if (!jobId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/jobs/${jobId}`)
        if (!res.ok) throw new Error('Failed to load job')
        const data = (await res.json()) as JobDetail
        if (!cancelled) setJob(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load job')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [jobId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="size-6 animate-spin text-brand" />
        <p className="text-sm text-muted">Loading applications…</p>
      </div>
    )
  }

  if (error || !job || !jobId) {
    return <Alert variant="danger">{error ?? 'Job not found'}</Alert>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description={`Review and manage candidates for this role.`}
        breadcrumbs={[
          { label: 'Job Board', href: '/dashboard/jobs' },
          { label: job.title, href: `/dashboard/jobs/${jobId}/edit` },
          { label: 'Applications' },
        ]}
      />
      <ApplicationsTable jobId={jobId} jobTitle={job.title} />
    </div>
  )
}
