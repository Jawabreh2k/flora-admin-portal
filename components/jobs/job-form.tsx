'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input, Label, Select, Textarea, FormError } from '@/components/ui/input'
import {
  JOB_STATUSES,
  JOB_TYPES,
  LOCATION_TYPES,
  formatEnumLabel,
  type Company,
  type JobDetail,
} from '@/lib/jobs/types'
import { upsertJobSchema, type UpsertJobFormValues } from '@/lib/jobs/schema'

async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/jobs/companies')
  if (!res.ok) throw new Error('Failed to load companies')
  return res.json()
}

function toFormValues(job?: JobDetail, defaultCompanyId?: string): UpsertJobFormValues {
  if (job) {
    return {
      companyId: job.company.id,
      title: job.title,
      department: job.department,
      locationType: job.locationType,
      locationText: job.locationText,
      jobType: job.jobType,
      description: job.description,
      requirements: job.requirements.length ? job.requirements : [''],
      responsibilities: job.responsibilities.length ? job.responsibilities : [''],
      salaryRange: job.salaryRange,
      status: job.status,
      closingDate: job.closingDate ? job.closingDate.slice(0, 16) : null,
    }
  }

  return {
    companyId: defaultCompanyId ?? '',
    title: '',
    department: '',
    locationType: 'HYBRID',
    locationText: '',
    jobType: 'FULL_TIME',
    description: '',
    requirements: [''],
    responsibilities: [''],
    salaryRange: '',
    status: 'DRAFT',
    closingDate: null,
  }
}

function DynamicList({
  label,
  description,
  items,
  onAdd,
  onRemove,
  register,
  fieldName,
}: {
  label: string
  description: string
  items: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  register: ReturnType<typeof useForm<UpsertJobFormValues>>['register']
  fieldName: 'requirements' | 'responsibilities'
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((_, index) => (
          <div key={`${fieldName}-${index}`} className="flex gap-2">
            <Input {...register(`${fieldName}.${index}` as const)} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onRemove(index)}
              disabled={items.length === 1}
              aria-label={`Remove item ${index + 1}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="size-4" />
          Add {label.toLowerCase().slice(0, -1)}
        </Button>
      </CardContent>
    </Card>
  )
}

export function JobForm({
  job,
  onSubmit,
  isSubmitting,
  submitLabel,
}: {
  job?: JobDetail
  onSubmit: (values: UpsertJobFormValues) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
}) {
  const companiesQuery = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  })

  const form = useForm<UpsertJobFormValues>({
    resolver: zodResolver(upsertJobSchema),
    defaultValues: toFormValues(job),
  })

  const requirements = form.watch('requirements')
  const responsibilities = form.watch('responsibilities')

  useEffect(() => {
    if (companiesQuery.data?.[0] && !form.getValues('companyId')) {
      form.setValue('companyId', companiesQuery.data[0].id)
    }
  }, [companiesQuery.data, form])

  useEffect(() => {
    if (job) form.reset(toFormValues(job))
  }, [job, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      requirements: values.requirements.filter((item) => item.trim()),
      responsibilities: values.responsibilities.filter((item) => item.trim()),
      salaryRange: values.salaryRange?.trim() || null,
      closingDate: values.closingDate ? new Date(values.closingDate).toISOString() : null,
    }
    await onSubmit(payload)
  })

  if (companiesQuery.isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
          <Loader2 className="size-6 animate-spin text-brand" />
          <p className="text-sm text-muted">Loading form…</p>
        </CardContent>
      </Card>
    )
  }

  if (companiesQuery.isError) {
    return (
      <Card>
        <CardContent className="py-16 text-center text-sm text-danger">
          Failed to load companies. Refresh and try again.
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-24">
      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
          <CardDescription>Core information shown on the public careers page.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="companyId">Company</Label>
            <Select id="companyId" {...form.register('companyId')}>
              <option value="">Select company</option>
              {companiesQuery.data?.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </Select>
            {form.formState.errors.companyId && (
              <FormError>{form.formState.errors.companyId.message}</FormError>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" placeholder="e.g. Senior Software Engineer" {...form.register('title')} />
            {form.formState.errors.title && (
              <FormError>{form.formState.errors.title.message}</FormError>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" placeholder="e.g. Engineering" {...form.register('department')} />
            {form.formState.errors.department && (
              <FormError>{form.formState.errors.department.message}</FormError>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Location type</Label>
            <Select id="locationType" {...form.register('locationType')}>
              {LOCATION_TYPES.map((value) => (
                <option key={value} value={value}>
                  {formatEnumLabel(value)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationText">Location</Label>
            <Input id="locationText" placeholder="Amman, Jordan" {...form.register('locationText')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobType">Employment type</Label>
            <Select id="jobType" {...form.register('jobType')}>
              {JOB_TYPES.map((value) => (
                <option key={value} value={value}>
                  {formatEnumLabel(value)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryRange">Salary range</Label>
            <Input id="salaryRange" placeholder="JOD 800 – 1,200" {...form.register('salaryRange')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" {...form.register('status')}>
              {JOB_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {formatEnumLabel(value)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="closingDate">Closing date</Label>
            <Input id="closingDate" type="datetime-local" {...form.register('closingDate')} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={8}
              placeholder="Describe the role, team, and what makes this opportunity exciting…"
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <FormError>{form.formState.errors.description.message}</FormError>
            )}
          </div>
        </CardContent>
      </Card>

      <DynamicList
        label="Requirements"
        description="Add bullet points for candidate requirements."
        items={requirements}
        onAdd={() => form.setValue('requirements', [...requirements, ''])}
        onRemove={(index) =>
          form.setValue(
            'requirements',
            requirements.filter((_, i) => i !== index),
          )
        }
        register={form.register}
        fieldName="requirements"
      />

      <DynamicList
        label="Responsibilities"
        description="Outline day-to-day responsibilities for the role."
        items={responsibilities}
        onAdd={() => form.setValue('responsibilities', [...responsibilities, ''])}
        onRemove={(index) =>
          form.setValue(
            'responsibilities',
            responsibilities.filter((_, i) => i !== index),
          )
        }
        register={form.register}
        fieldName="responsibilities"
      />

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 px-4 py-4 backdrop-blur-md lg:start-[260px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="hidden text-sm text-muted sm:block">
            {form.formState.isDirty ? 'You have unsaved changes' : 'All changes saved locally'}
          </p>
          <div className="flex w-full justify-end gap-2 sm:w-auto">
            <Link href="/dashboard/jobs">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
//test
