'use client'

import Link from 'next/link'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Archive, Briefcase, Edit2, EyeOff, Loader2, MoreHorizontal, Plus, Search, Send, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { JobStatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuItem, DropdownMenuLink, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableSkeleton,
} from '@/components/ui/table'
import {
  formatEnumLabel,
  type AdminJobListItem,
  type JobStatus,
  type PaginatedResponse,
} from '@/lib/jobs/types'

async function fetchJobs(params: {
  page: number
  search: string
  status: JobStatus | 'ALL'
}): Promise<PaginatedResponse<AdminJobListItem>> {
  const query = new URLSearchParams({ page: String(params.page) })
  if (params.search.trim()) query.set('search', params.search.trim())
  if (params.status !== 'ALL') query.set('status', params.status)
  const res = await fetch(`/api/jobs?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to load jobs')
  return res.json()
}

async function patchJobStatus(id: string, status: JobStatus) {
  const res = await fetch(`/api/jobs/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update job status')
  return res.json()
}

type ConfirmAction = { id: string; title: string; status: JobStatus; label: string }

export function JobsListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'ALL'>('ALL')
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Debounce the search box so we hit the API at most ~3×/sec while typing.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handle)
  }, [search])

  // Any filter change resets back to the first page of the new result set.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  const query = useQuery({
    queryKey: ['admin-jobs', { page, search: debouncedSearch, status: statusFilter }],
    queryFn: () => fetchJobs({ page, search: debouncedSearch, status: statusFilter }),
    placeholderData: keepPreviousData,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) => patchJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })
      setConfirmAction(null)
    },
  })

  // The server already applied search/status, so render the page as-is.
  const jobs = query.data?.items ?? []

  const stats = useMemo(() => {
    if (!query.data) return null
    const items = query.data.items
    return {
      published: items.filter((j) => j.status === 'PUBLISHED').length,
      draft: items.filter((j) => j.status === 'DRAFT').length,
      applications: items.reduce((sum, j) => sum + j.applicationCount, 0),
    }
  }, [query.data])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Board"
        description="Create, publish, and manage open roles on the public careers page."
        breadcrumbs={[{ label: 'Job Board' }]}
        actions={
          <Link href="/dashboard/jobs/new">
            <Button>
              <Plus className="size-4" />
              New job
            </Button>
          </Link>
        }
      />

      {/* Quick stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Published', value: stats.published, color: 'text-success' },
            { label: 'Drafts', value: stats.draft, color: 'text-muted' },
            { label: 'Total applications', value: stats.applications, color: 'text-brand' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-surface px-5 py-4 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">{stat.label}</p>
              <p className={`mt-1 text-2xl font-semibold tabular-nums ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>All postings</CardTitle>
            <CardDescription>Draft, published, and archived roles across companies.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input
                placeholder="Search jobs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 sm:w-56"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as JobStatus | 'ALL')}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm shadow-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {query.isLoading && <TableSkeleton rows={6} />}

          {query.isError && (
            <Alert variant="danger">Failed to load jobs. Please refresh the page.</Alert>
          )}

          {query.data && jobs.length === 0 && (
            <EmptyState
              icon={Briefcase}
              title={search || statusFilter !== 'ALL' ? 'No matching jobs' : 'No job postings yet'}
              description={
                search || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first job posting to start receiving applications.'
              }
              action={
                !search &&
                statusFilter === 'ALL' && (
                  <Link href="/dashboard/jobs/new">
                    <Button>
                      <Plus className="size-4" />
                      Create first job
                    </Button>
                  </Link>
                )
              }
            />
          )}

          {query.data && jobs.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                        <div className="mt-0.5 text-xs text-muted">
                          {formatEnumLabel(job.jobType)} · {formatEnumLabel(job.locationType)}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted">{job.department}</TableCell>
                      <TableCell className="text-muted">{job.company.name}</TableCell>
                      <TableCell>
                        <JobStatusBadge status={job.status} />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/jobs/${job.id}/applications`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-muted"
                        >
                          <Users className="size-3.5" />
                          {job.applicationCount}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu
                          open={openMenu === job.id}
                          onOpenChange={(open) => setOpenMenu(open ? job.id : null)}
                          trigger={
                            <Button variant="ghost" size="icon">
                              {statusMutation.isPending && statusMutation.variables?.id === job.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="size-4" />
                              )}
                            </Button>
                          }
                        >
                          <DropdownMenuLink
                            href={`/dashboard/jobs/${job.id}/edit`}
                            className="gap-2"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Edit2 className="size-3.5 shrink-0 text-muted" />
                            Edit posting
                          </DropdownMenuLink>
                          <DropdownMenuLink
                            href={`/dashboard/jobs/${job.id}/applications`}
                            className="gap-2"
                            onClick={() => setOpenMenu(null)}
                          >
                            <Users className="size-3.5 shrink-0 text-muted" />
                            View applications
                          </DropdownMenuLink>
                          {job.status !== 'PUBLISHED' && (
                            <DropdownMenuItem
                              className="gap-2"
                              disabled={statusMutation.isPending}
                              onClick={() => {
                                setOpenMenu(null)
                                setConfirmAction({
                                  id: job.id,
                                  title: job.title,
                                  status: 'PUBLISHED',
                                  label: 'Publish',
                                })
                              }}
                            >
                              <Send className="size-3.5 shrink-0 text-muted" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {job.status !== 'DRAFT' && (
                            <DropdownMenuItem
                              className="gap-2"
                              disabled={statusMutation.isPending}
                              onClick={() => {
                                setOpenMenu(null)
                                setConfirmAction({
                                  id: job.id,
                                  title: job.title,
                                  status: 'DRAFT',
                                  label: 'Unpublish',
                                })
                              }}
                            >
                              <EyeOff className="size-3.5 shrink-0 text-muted" />
                              Move to draft
                            </DropdownMenuItem>
                          )}
                          {job.status !== 'ARCHIVED' && (
                            <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="gap-2 text-danger hover:bg-danger-bg"
                              disabled={statusMutation.isPending}
                              onClick={() => {
                                setOpenMenu(null)
                                setConfirmAction({
                                  id: job.id,
                                  title: job.title,
                                  status: 'ARCHIVED',
                                  label: 'Archive',
                                })
                              }}
                            >
                              <Archive className="size-3.5 shrink-0" />
                              Archive
                            </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <p className="text-sm text-muted">
                  Page {query.data.page} · {query.data.totalCount} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!query.data.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
        title={`${confirmAction?.label} job posting?`}
        description={
          confirmAction?.status === 'PUBLISHED'
            ? `"${confirmAction?.title}" will become visible on the public careers page.`
            : confirmAction?.status === 'DRAFT'
              ? `"${confirmAction?.title}" will be moved back to draft and hidden from the careers page.`
              : `"${confirmAction?.title}" will be archived and hidden from the careers page.`
        }
        confirmLabel={confirmAction?.label ?? 'Confirm'}
        variant={confirmAction?.status === 'ARCHIVED' ? 'destructive' : 'default'}
        loading={statusMutation.isPending}
        onConfirm={() => {
          if (confirmAction) {
            statusMutation.mutate({ id: confirmAction.id, status: confirmAction.status })
          }
        }}
      />
    </div>
  )
}
