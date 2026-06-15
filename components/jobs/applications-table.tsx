'use client'

import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Inbox, Loader2, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Alert, EmptyState } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ApplicationStatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu'
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
  APPLICATION_STATUSES,
  formatEnumLabel,
  type Application,
  type ApplicationStatus,
  type PaginatedResponse,
} from '@/lib/jobs/types'

async function fetchApplications(
  jobId: string,
  page: number,
): Promise<PaginatedResponse<Application>> {
  const res = await fetch(`/api/jobs/${jobId}/applications?page=${page}`)
  if (!res.ok) throw new Error('Failed to load applications')
  return res.json()
}

async function patchApplicationStatus(id: string, status: ApplicationStatus) {
  const res = await fetch(`/api/applications/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error('Failed to update status')
  return res.json() as Promise<Application>
}

export function ApplicationsTable({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['applications', jobId, page],
    queryFn: () => fetchApplications(jobId, page),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      patchApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', jobId] })
      setOpenMenu(null)
    },
  })

  const apiBase = process.env.NEXT_PUBLIC_FLORA_API_URL ?? 'http://localhost:5253'

  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Candidates who applied for{' '}
          <span className="font-medium text-foreground">{jobTitle}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {query.isLoading && <TableSkeleton rows={5} />}

        {query.isError && (
          <Alert variant="danger">Failed to load applications. Please try again.</Alert>
        )}

        {query.data && query.data.items.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="No applications yet"
            description="When candidates apply for this role, their details will appear here."
          />
        )}

        {query.data && query.data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.items.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="font-medium">{application.candidateName}</div>
                      {application.coverLetter && (
                        <p className="mt-1 line-clamp-2 max-w-xs text-xs text-muted">
                          {application.coverLetter}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{application.candidateEmail}</div>
                      {application.candidatePhone && (
                        <div className="text-xs text-muted">{application.candidatePhone}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <ApplicationStatusBadge status={application.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted">
                      {new Date(application.appliedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`${apiBase}${application.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            Resume
                            <ExternalLink className="size-3" />
                          </Button>
                        </Link>
                        <DropdownMenu
                          open={openMenu === application.id}
                          onOpenChange={(open) =>
                            setOpenMenu(open ? application.id : null)
                          }
                          trigger={
                            <Button variant="ghost" size="icon">
                              {mutation.isPending && mutation.variables?.id === application.id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="size-4" />
                              )}
                            </Button>
                          }
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              disabled={
                                status === application.status ||
                                (mutation.isPending && mutation.variables?.id === application.id)
                              }
                              onClick={() =>
                                mutation.mutate({ id: application.id, status })
                              }
                            >
                              Mark as {formatEnumLabel(status)}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenu>
                      </div>
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
  )
}
