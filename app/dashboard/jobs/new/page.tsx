'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { JobForm } from '@/components/jobs/job-form'
import type { UpsertJobFormValues } from '@/lib/jobs/schema'

export default function NewJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: UpsertJobFormValues) => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? 'Failed to create job')
      }
      router.push('/dashboard/jobs')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create job posting"
        description="Publish a new role to the public careers portal."
        breadcrumbs={[
          { label: 'Job Board', href: '/dashboard/jobs' },
          { label: 'New job' },
        ]}
      />
      {error && <Alert variant="danger">{error}</Alert>}
      <JobForm onSubmit={onSubmit} isSubmitting={isSubmitting} submitLabel="Create job" />
    </div>
  )
}
