'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, ExternalLink, Pencil, Plus } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert, EmptyState } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table'
import { CompanyDialog } from './company-dialog'
import type { UpsertCompanyFormValues } from '@/lib/companies/schema'
import type { Company } from '@/lib/jobs/types'

async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/companies')
  if (!res.ok) throw new Error('Failed to load companies')
  return res.json()
}

async function postCompany(values: UpsertCompanyFormValues): Promise<Company> {
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? 'Failed to create company')
  }
  return res.json()
}

async function putCompany(id: string, values: UpsertCompanyFormValues): Promise<Company> {
  const res = await fetch(`/api/companies/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? 'Failed to update company')
  }
  return res.json()
}

export function CompaniesPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  const query = useQuery({
    queryKey: ['admin-companies'],
    queryFn: fetchCompanies,
  })

  const mutation = useMutation({
    mutationFn: (values: UpsertCompanyFormValues) =>
      editingCompany ? putCompany(editingCompany.id, values) : postCompany(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] })
      setDialogOpen(false)
    },
  })

  function openCreate() {
    setEditingCompany(null)
    setDialogOpen(true)
  }

  function openEdit(company: Company) {
    setEditingCompany(company)
    setDialogOpen(true)
  }

  const companies = query.data ?? []

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Every company a job posting can be filed under."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Add company
          </Button>
        }
      />

      {query.isError && (
        <Alert variant="warning" className="mb-4">
          Could not load companies. Is the CMS API running?
        </Alert>
      )}
      {mutation.isError && (
        <Alert variant="warning" className="mb-4">
          {mutation.error instanceof Error ? mutation.error.message : 'Something went wrong.'}
        </Alert>
      )}

      {query.isLoading ? (
        <TableSkeleton rows={4} />
      ) : companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add one before creating a job posting — every role needs a company to be filed under."
          action={
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add company
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium text-foreground">{company.name}</TableCell>
                <TableCell>
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand hover:underline"
                    >
                      {company.website}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <span className="text-subtle">—</span>
                  )}
                </TableCell>
                <TableCell className="max-w-sm truncate text-muted">
                  {company.description || <span className="text-subtle">—</span>}
                </TableCell>
                <TableCell className="text-end">
                  <Button variant="outline" size="sm" onClick={() => openEdit(company)}>
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <CompanyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        company={editingCompany}
        onSubmit={(values) => mutation.mutateAsync(values).then(() => undefined)}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
