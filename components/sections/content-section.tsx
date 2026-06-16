'use client'

import {
  CONTENT_SCHEMA,
  LOCALES,
  LOCALE_LABELS,
  type EditableContent,
  type Locale,
  type UiConfigPayload,
} from '@/lib/types'
import { cn } from '@/lib/utils'
import { buildMapEmbedSrc } from '@/lib/maps'
import { Card, Field, TextArea, TextInput } from '../editor/inputs'

/** Groups CONTENT_SCHEMA entries by their `page` label for section headers. */
function groupByPage(schema: typeof CONTENT_SCHEMA) {
  const pages: { page: string; entries: typeof CONTENT_SCHEMA }[] = []
  for (const entry of schema) {
    const existing = pages.find((p) => p.page === entry.page)
    if (existing) existing.entries.push(entry)
    else pages.push({ page: entry.page, entries: [entry] })
  }
  return pages
}

const PAGES = groupByPage(CONTENT_SCHEMA)

export function ContentSection({
  payload,
  setContent,
  locale,
  onLocaleChange,
  activePage,
  onPageChange,
}: {
  payload: UiConfigPayload
  setContent: (locale: Locale, group: keyof EditableContent, key: string, value: string) => void
  locale: Locale
  onLocaleChange: (l: Locale) => void
  activePage: string
  onPageChange: (p: string) => void
}) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const content = payload.content[locale]

  const currentEntries = PAGES.find((p) => p.page === activePage)?.entries ?? []

  return (
    <div className="space-y-5">
      {/* Locale + page switcher row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Locale tabs */}
        <div className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-sm">
          {LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => onLocaleChange(l)}
              className={cn(
                'rounded-md px-4 py-1.5 text-sm font-medium transition-colors',
                locale === l ? 'bg-brand text-white shadow-sm' : 'text-muted hover:bg-surface-sunken hover:text-foreground',
              )}
            >
              {LOCALE_LABELS[l]}
            </button>
          ))}
        </div>

        {/* Page tabs */}
        <div className="flex flex-wrap gap-1.5">
          {PAGES.map((p) => (
            <button
              key={p.page}
              onClick={() => onPageChange(p.page)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                activePage === p.page
                  ? 'border-brand bg-brand-muted text-brand'
                  : 'border-border text-muted hover:border-border-strong hover:text-foreground',
              )}
            >
              {p.page}
            </button>
          ))}
        </div>
      </div>

      {/* Cards for the active page */}
      <div className="space-y-4">
        {currentEntries.map((entry, idx) => {
          const groupValues = (content[entry.group] ?? {}) as Record<string, string>
          return (
            <Card key={`${entry.group}-${idx}`} title={entry.label}>
              <div className="space-y-3">
                {entry.fields.map((field) => {
                  const isMapLocation = entry.group === 'contact' && field.key === 'mapLocation'
                  const mapPreviewSrc = isMapLocation
                    ? buildMapEmbedSrc(groupValues[field.key])
                    : null
                  return (
                    <Field key={field.key} label={field.label} hint={field.hint}>
                      {field.multiline ? (
                        <TextArea
                          dir={dir}
                          value={groupValues[field.key] ?? ''}
                          onChange={(v) => setContent(locale, entry.group, field.key, v)}
                        />
                      ) : (
                        <TextInput
                          dir={dir}
                          value={groupValues[field.key] ?? ''}
                          onChange={(v) => setContent(locale, entry.group, field.key, v)}
                        />
                      )}

                      {isMapLocation && (
                        <div className="mt-2.5">
                          {mapPreviewSrc ? (
                            <div className="overflow-hidden rounded-lg border border-border">
                              <iframe
                                key={mapPreviewSrc}
                                title="Map preview"
                                src={mapPreviewSrc}
                                width="100%"
                                height="220"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="block w-full"
                              />
                              <p className="bg-surface-sunken px-3 py-1.5 text-xs text-subtle">
                                Live preview — confirm the pin is correct before saving.
                              </p>
                            </div>
                          ) : (
                            <p className="rounded-lg border border-dashed border-border bg-surface-sunken px-3 py-4 text-center text-xs text-subtle">
                              Enter a Maps link, address, or coordinates to preview the map.
                            </p>
                          )}
                        </div>
                      )}
                    </Field>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
