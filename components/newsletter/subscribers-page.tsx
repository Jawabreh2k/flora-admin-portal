'use client'

import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Download, Loader2, MailPlus, Search } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { Alert, EmptyState } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
import type { NewsletterSubscription, PaginatedResponse } from '@/lib/newsletter/types'

async function fetchSubscribers(params: {
  page: number
  pageSize?: number
  search: string
}): Promise<PaginatedResponse<NewsletterSubscription>> {
  const query = new URLSearchParams({ page: String(params.page) })
  if (params.pageSize) query.set('pageSize', String(params.pageSize))
  if (params.search.trim()) query.set('search', params.search.trim())
  const res = await fetch(`/api/newsletter?${query.toString()}`)
  if (!res.ok) throw new Error('Failed to load subscribers')
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

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

export function SubscribersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  // Debounce the search box so we hit the API at most ~3×/sec while typing.
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handle)
  }, [search])

  // Any filter change resets back to the first page of the new result set.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const query = useQuery({
    queryKey: ['admin-subscribers', { page, search: debouncedSearch }],
    queryFn: () => fetchSubscribers({ page, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  })

  const subscribers = query.data?.items ?? []
  const totalCount = query.data?.totalCount ?? 0
  const pageSize = query.data?.pageSize ?? 20
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  /**
   * Walks every page (500 rows per request, ignoring the current search filter)
   * and downloads the complete list — marketing wants the whole audience, not
   * the page on screen.
   */
  async function exportCsv() {
    setExporting(true)
    setExportError(null)
    try {
      const all: NewsletterSubscription[] = []
      let pageNum = 1
      let hasNext = true
      while (hasNext) {
        const batch = await fetchSubscribers({ page: pageNum, pageSize: 500, search: '' })
        all.push(...batch.items)
        hasNext = batch.hasNextPage
        pageNum += 1
      }

      const rows = [
        ['Email', 'Locale', 'Subscribed at (UTC)'],
        ...all.map((s) => [s.email, s.locale, s.createdAtUtc]),
      ]
      const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\r\n')

      const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setExportError('Export failed — please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Newsletter subscribers"
        description="Signups captured from the public site footer."
        actions={
          <Button onClick={exportCsv} disabled={exporting || totalCount === 0} variant="outline">
            {exporting ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Export CSV
          </Button>
        }
      />

      {exportError && <Alert variant="warning" className="mb-4">{exportError}</Alert>}
      {query.isError && (
        <Alert variant="warning" className="mb-4">
          Could not load subscribers. Is the CMS API running?
        </Alert>
      )}

      <div className="mb-4 max-w-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email"
            className="ps-9"
          />
        </div>
      </div>

      {query.isLoading ? (
        <TableSkeleton rows={6} />
      ) : subscribers.length === 0 ? (
        <EmptyState
          icon={MailPlus}
          title={debouncedSearch ? 'No matching subscribers' : 'No subscribers yet'}
          description={
            debouncedSearch
              ? 'Try a different search term.'
              : 'Signups from the public site footer will appear here.'
          }
        />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Locale</TableHead>
                <TableHead>Subscribed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.email}</TableCell>
                  <TableCell className="uppercase text-muted">{s.locale}</TableCell>
                  <TableCell className="text-muted">{formatDate(s.createdAtUtc)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <p>
              {totalCount.toLocaleString()} subscriber{totalCount === 1 ? '' : 's'}
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="tabular-nums">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!query.data?.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
