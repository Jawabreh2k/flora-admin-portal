'use client'

import { useEffect, useState } from 'react'
import { Loader2, RotateCcw } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import type { RevisionSummary, UiConfigResponse } from '@/lib/types'

export type RestoreResult = UiConfigResponse & { revalidated?: boolean }

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

export function RevisionHistoryDialog({
  open,
  onOpenChange,
  onRestored,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRestored: (result: RestoreResult) => void
}) {
  const [revisions, setRevisions] = useState<RevisionSummary[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmRev, setConfirmRev] = useState<number | null>(null)
  const [restoringRev, setRestoringRev] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setConfirmRev(null)
    setRestoringRev(null)
    setLoading(true)
    fetch('/api/config/history')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((data: RevisionSummary[]) => setRevisions(data))
      .catch(() => setError('Failed to load version history.'))
      .finally(() => setLoading(false))
  }, [open])

  async function restore(revision: number) {
    setRestoringRev(revision)
    setError(null)
    try {
      const res = await fetch(`/api/config/history/${revision}/restore`, { method: 'POST' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Restore failed.')
      onRestored(data as RestoreResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed.')
      setRestoringRev(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Version history"
      description="Restore a previous saved version. The current version is archived first, so you can always roll forward again."
    >
      <div className="space-y-3">
        {error && <Alert variant="danger">{error}</Alert>}

        {loading && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" />
            Loading…
          </div>
        )}

        {!loading && revisions && revisions.length === 0 && (
          <div className="rounded-lg border border-border bg-surface-sunken/50 px-4 py-6 text-center text-sm text-muted">
            No previous versions yet. Saved changes will appear here.
          </div>
        )}

        {!loading && revisions && revisions.length > 0 && (
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
            {revisions.map((r) => (
              <li key={r.revision} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">Revision {r.revision}</p>
                  <p className="truncate text-xs text-muted">
                    {formatDate(r.savedAtUtc)} · {r.savedBy ?? 'unknown'}
                  </p>
                </div>

                {confirmRev === r.revision ? (
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={restoringRev !== null}
                      onClick={() => restore(r.revision)}
                    >
                      {restoringRev === r.revision ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="size-3.5" />
                      )}
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={restoringRev !== null}
                      onClick={() => setConfirmRev(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    disabled={restoringRev !== null}
                    onClick={() => setConfirmRev(r.revision)}
                  >
                    <RotateCcw className="size-3.5" />
                    Restore
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  )
}
