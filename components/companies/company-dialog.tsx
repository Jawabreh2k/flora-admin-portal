'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Label, Textarea, FormError } from '@/components/ui/input'
import { upsertCompanySchema, type UpsertCompanyFormValues } from '@/lib/companies/schema'
import type { Company } from '@/lib/jobs/types'

function toFormValues(company?: Company | null): UpsertCompanyFormValues {
  return {
    name: company?.name ?? '',
    logoUrl: company?.logoUrl ?? '',
    website: company?.website ?? '',
    description: company?.description ?? '',
  }
}

export function CompanyDialog({
  open,
  onOpenChange,
  company,
  onSubmit,
  isSubmitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Present → editing; absent → creating a new company. */
  company?: Company | null
  onSubmit: (values: UpsertCompanyFormValues) => Promise<void>
  isSubmitting: boolean
}) {
  const form = useForm<UpsertCompanyFormValues>({
    resolver: zodResolver(upsertCompanySchema),
    defaultValues: toFormValues(company),
  })

  // Re-seed the form whenever the dialog opens for a (possibly different) company,
  // rather than only on mount — the dialog instance is shared across rows.
  useEffect(() => {
    if (open) form.reset(toFormValues(company))
  }, [open, company, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      name: values.name.trim(),
      logoUrl: values.logoUrl?.trim() || null,
      website: values.website?.trim() || null,
      description: values.description?.trim() || null,
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={company ? 'Edit company' : 'Add company'}
      description="Companies group job postings — set one here, then select it when creating a role."
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {company ? 'Save changes' : 'Add company'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company-name">Name</Label>
          <Input id="company-name" placeholder="e.g. Flora Technology" {...form.register('name')} />
          {form.formState.errors.name && <FormError>{form.formState.errors.name.message}</FormError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-website">Website</Label>
          <Input id="company-website" placeholder="https://…" {...form.register('website')} />
          {form.formState.errors.website && <FormError>{form.formState.errors.website.message}</FormError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-logo">Logo URL</Label>
          <Input id="company-logo" placeholder="https://…" {...form.register('logoUrl')} />
          {form.formState.errors.logoUrl && <FormError>{form.formState.errors.logoUrl.message}</FormError>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company-description">Description</Label>
          <Textarea id="company-description" rows={3} {...form.register('description')} />
          {form.formState.errors.description && (
            <FormError>{form.formState.errors.description.message}</FormError>
          )}
        </div>
      </form>
    </Dialog>
  )
}
