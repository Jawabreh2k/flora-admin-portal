'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  Archive,
  ArchiveRestore,
  CornerUpLeft,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  MoreHorizontal,
  Search,
} from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert, EmptyState } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { InquiryStatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
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
import { formatEnumLabel } from '@/lib/jobs/types'
import type {
  ContactInquiry,
  ContactInquirySummary,
  InquiryStatus,
  PaginatedResponse,
} from '@/lib/inquiries/types'

async function fetchInquiries(params: {
  page: number
  search: string
  status: InquiryStatus | 'ALL'
}): Promise<PaginatedResponse<ContactInquiry>> {
  const query = new URLSearchParams({ page: String(params.page) })
  if (params.search.trim()) query.set('search', params.search.trim())
  if (params.status !== 'ALL') query.set('status', params.status)
  const res = await fetch(`/api/inquiries?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to load inquiries')
  return res.json()
}

async function fetchSummary(): Promise<ContactInquirySummary> {
  const res = await fetch('/api/inquiries/summary')
  if (!res.ok) throw new Error('Failed to load summary')
  return res.json()
}

async function patchInquiryStatus(id: string, status: InquiryStatus) {
  const res = await fetch(`/api/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update inquiry')
  return res.json()
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(iso: string): string {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

export function InquiriesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'ALL'>('ALL')
  const [selected, setSelected] = useState<ContactInquiry | null>(null)
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
    queryKey: ['admin-inquiries', { page, search: debouncedSearch, status: statusFilter }],
    queryFn: () => fetchInquiries({ page, search: debouncedSearch, status: statusFilter }),
    placeholderData: keepPreviousData,
  })

  const summaryQuery = useQuery({
    queryKey: ['admin-inquiries-summary'],
    queryFn: fetchSummary,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: InquiryStatus }) => patchInquiryStatus(id, status),
    onSuccess: (updated: ContactInquiry) => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] })
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries-summary'] })
      setSelected((current) => (current && current.id === updated.id ? updated : current))
    },
  })

  const inquiries = query.data?.items ?? []

  const stats = useMemo(
    () => [
      { label: 'Unread', value: summaryQuery.data?.unread ?? 0, color: 'text-brand' },
      { label: 'Total received', value: summaryQuery.data?.total ?? 0, color: 'text-foreground' },
    ],
    [summaryQuery.data],
  )

  function openInquiry(inquiry: ContactInquiry) {
    setSelected(inquiry)
    // Opening an unread inquiry acknowledges it.
    if (inquiry.status === 'NEW') {
      setSelected({ ...inquiry, status: 'READ' })
      statusMutation.mutate({ id: inquiry.id, status: 'READ' })
    }
  }

  function setStatus(id: string, status: InquiryStatus) {
    setOpenMenu(null)
    statusMutation.mutate({ id, status })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inquiries"
        description="Messages submitted through the public contact form."
        breadcrumbs={[{ label: 'Inquiries' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface px-5 py-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-subtle">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Newest first. Open a message to read it and mark it as read.</CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <Input
                placeholder="Search name, email, subject…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | 'ALL')}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-sm shadow-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="NEW">New</option>
              <option value="READ">Read</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {query.isLoading && <TableSkeleton rows={6} />}

          {query.isError && <Alert variant="danger">Failed to load inquiries. Please refresh the page.</Alert>}

          {query.data && inquiries.length === 0 && (
            <EmptyState
              icon={Inbox}
              title={search || statusFilter !== 'ALL' ? 'No matching inquiries' : 'No inquiries yet'}
              description={
                search || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Messages from the public contact form will appear here.'
              }
            />
          )}

          {query.data && inquiries.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow
                      key={inquiry.id}
                      onClick={() => openInquiry(inquiry)}
                      className={`cursor-pointer ${inquiry.status === 'NEW' ? 'font-medium' : ''}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {inquiry.status === 'NEW' && (
                            <span className="size-1.5 shrink-0 rounded-full bg-brand" aria-label="Unread" />
                          )}
                          <div className="min-w-0">
                            <div className="truncate">{inquiry.name}</div>
                            <div className="truncate text-xs font-normal text-muted">{inquiry.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[22rem]">
                        <span className="block truncate text-muted">{inquiry.subject}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted">{formatDate(inquiry.createdAtUtc)}</TableCell>
                      <TableCell>
                        <InquiryStatusBadge status={inquiry.status} />
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu
                          open={openMenu === inquiry.id}
                          onOpenChange={(open) => setOpenMenu(open ? inquiry.id : null)}
                          trigger={
                            <Button variant="ghost" size="icon">
                              {statusMutation.isPending && statusMutation.variables?.id === inquiry.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="size-4" />
                              )}
                            </Button>
                          }
                        >
                          <DropdownMenuItem className="gap-2" onClick={() => openInquiry(inquiry)}>
                            <Mail className="size-3.5 shrink-0 text-muted" />
                            Open
                          </DropdownMenuItem>
                          {inquiry.status === 'NEW' ? (
                            <DropdownMenuItem className="gap-2" onClick={() => setStatus(inquiry.id, 'READ')}>
                              <MailOpen className="size-3.5 shrink-0 text-muted" />
                              Mark as read
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-2" onClick={() => setStatus(inquiry.id, 'NEW')}>
                              <Mail className="size-3.5 shrink-0 text-muted" />
                              Mark as unread
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {inquiry.status === 'ARCHIVED' ? (
                            <DropdownMenuItem className="gap-2" onClick={() => setStatus(inquiry.id, 'READ')}>
                              <ArchiveRestore className="size-3.5 shrink-0 text-muted" />
                              Restore to inbox
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-2" onClick={() => setStatus(inquiry.id, 'ARCHIVED')}>
                              <Archive className="size-3.5 shrink-0 text-muted" />
                              Archive
                            </DropdownMenuItem>
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
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
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

      <InquiryDetailDialog
        inquiry={selected}
        onClose={() => setSelected(null)}
        onArchive={(id) => {
          setStatus(id, 'ARCHIVED')
          setSelected(null)
        }}
      />
    </div>
  )
}

function InquiryDetailDialog({
  inquiry,
  onClose,
  onArchive,
}: {
  inquiry: ContactInquiry | null
  onClose: () => void
  onArchive: (id: string) => void
}) {
  if (!inquiry) return null

  const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(`Re: ${inquiry.subject}`)}`

  return (
    <Dialog
      open={!!inquiry}
      onOpenChange={(open) => !open && onClose()}
      title={inquiry.subject}
      footer={
        <>
          {inquiry.status !== 'ARCHIVED' && (
            <Button variant="outline" onClick={() => onArchive(inquiry.id)}>
              <Archive className="size-4" />
              Archive
            </Button>
          )}
          <a href={mailto}>
            <Button>
              <CornerUpLeft className="size-4" />
              Reply by email
            </Button>
          </a>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-foreground">{inquiry.name}</p>
            <a href={`mailto:${inquiry.email}`} className="truncate text-sm text-brand hover:underline">
              {inquiry.email}
            </a>
          </div>
          <InquiryStatusBadge status={inquiry.status} />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-border bg-surface-sunken/50 px-4 py-3 text-sm">
          <div>
            <dt className="text-xs text-subtle">Company</dt>
            <dd className="text-foreground">{inquiry.company || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">Language</dt>
            <dd className="text-foreground">{inquiry.locale === 'ar' ? 'Arabic' : 'English'}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-subtle">Received</dt>
            <dd className="text-foreground">{formatDate(inquiry.createdAtUtc)}</dd>
          </div>
        </dl>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-subtle">Message</p>
          <p className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground">
            {inquiry.message}
          </p>
        </div>
      </div>
    </Dialog>
  )
}
