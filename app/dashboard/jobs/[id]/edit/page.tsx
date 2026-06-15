'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { JobForm } from '@/components/jobs/job-form'
import type { JobDetail } from '@/lib/jobs/types'
import type { UpsertJobFormValues } from '@/lib/jobs/schema'

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [jobId, setJobId] = useState<string | null>(null)
  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => setJobId(id))
  }, [params])

  useEffect(() => {
    if (!jobId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
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

  const onSubmit = async (values: UpsertJobFormValues) => {
    if (!jobId) return
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Failed to update job')
      }
      router.push('/dashboard/jobs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <Loader2 className="size-6 animate-spin text-brand" />
        <p className="text-sm text-muted">Loading job details…</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <Alert variant="danger">{error ?? 'Job not found'}</Alert>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit job posting"
        description={job.title}
        breadcrumbs={[
          { label: 'Job Board', href: '/dashboard/jobs' },
          { label: job.title },
        ]}
      />
      {error && <Alert variant="danger">{error}</Alert>}
      <JobForm
        job={job}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Save changes"
      />
    </div>
  )
}
