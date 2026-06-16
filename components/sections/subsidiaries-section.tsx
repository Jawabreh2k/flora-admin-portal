'use client'

import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import type { Locale, ManagedSubsidiary, UiConfigPayload } from '@/lib/types'
import { ICON_PRESETS, LOCALES } from '@/lib/types'
import { uploadSubsidiaryAsset } from '@/lib/media'
import { Card, Field, TextArea, TextInput, Toggle, RadioGroup } from '../editor/inputs'
import { MediaAssetField } from '../editor/media-asset-field'
import { Button } from '../ui/button'
import { ConfirmDialog } from '../ui/dialog'
import { AddSubsidiaryDialog, type NewSubsidiaryDraft } from './add-subsidiary-dialog'
import { uniqueSlug } from '@/lib/slug'

/**
 * A fully-formed blank subsidiary. Every required field is populated (localized
 * objects, empty arrays) so neither the editor nor the public site can hit an
 * undefined and crash.
 */
function createEmptySubsidiary(existingSlugs: string[]): ManagedSubsidiary {
  return {
    slug: uniqueSlug('new-subsidiary', existingSlugs),
    icon: 'Package',
    name: { en: 'New Subsidiary', ar: 'شركة جديدة' },
    tag: { en: '', ar: '' },
    short: { en: '', ar: '' },
    established: { en: '', ar: '' },
    visual: { from: '#4a0e17', to: '#7a1f3a', glow: '#c5a880' },
    image: undefined,
    logo: undefined,
    paragraphs: { en: [], ar: [] },
    highlights: { en: [], ar: [] },
    metrics: { en: [], ar: [] },
    website: '',
    hasProfile: false,
    contact: { address: { en: '', ar: '' }, phone: undefined, fax: undefined, email: undefined },
  }
}

export function SubsidiariesSection({
  payload,
  setSubsidiaries,
}: {
  payload: UiConfigPayload
  setSubsidiaries: (subsidiaries: UiConfigPayload['subsidiaries']) => void
}) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null)
  const [locale, setLocale] = useState<Locale>('en')
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const subsidiaries = payload.subsidiaries?.items || []
  const enabled = payload.subsidiaries?.enabled ?? true

  const commit = (items: ManagedSubsidiary[]) => setSubsidiaries({ enabled, items })

  const updateSubsidiary = (slug: string, updates: Partial<ManagedSubsidiary>) => {
    commit(subsidiaries.map((s) => (s.slug === slug ? { ...s, ...updates } : s)))
  }

  const handleCreate = (draft: NewSubsidiaryDraft) => {
    // Start from a complete blank, then layer the few fields captured in the dialog.
    const base = createEmptySubsidiary(subsidiaries.map((s) => s.slug))
    const created: ManagedSubsidiary = {
      ...base,
      slug: draft.slug || base.slug,
      icon: draft.icon,
      // Fall back to the English name for Arabic so the AR view is never blank.
      name: { en: draft.nameEn, ar: draft.nameAr || draft.nameEn },
      tag: { en: draft.tagEn, ar: '' },
      short: { en: draft.shortEn, ar: '' },
    }
    commit([...subsidiaries, created])
    setExpandedSlug(created.slug) // open it so they can fill in the rest
    setAddOpen(false)
  }

  const removeSubsidiary = (slug: string) => {
    commit(subsidiaries.filter((s) => s.slug !== slug))
    if (expandedSlug === slug) setExpandedSlug(null)
    setPendingDeleteSlug(null)
  }

  /**
   * Slugs are the public URL (/subsidiaries/{slug}) and the row identity, so the
   * input is sanitized live to URL-safe characters. The list is keyed by index
   * (not slug) so editing the slug doesn't remount the row and steal focus.
   */
  const updateSlug = (oldSlug: string, raw: string) => {
    const newSlug = raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
    commit(subsidiaries.map((s) => (s.slug === oldSlug ? { ...s, slug: newSlug } : s)))
    if (expandedSlug === oldSlug) setExpandedSlug(newSlug)
  }

  const pendingDelete = subsidiaries.find((s) => s.slug === pendingDeleteSlug) ?? null

  const updateLocalized = <K extends keyof ManagedSubsidiary>(
    slug: string,
    field: K,
    locale: Locale,
    value: any,
  ) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const fieldValue = subsidiary[field]
    if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
      updateSubsidiary(slug, {
        [field]: { ...fieldValue, [locale]: value },
      } as any)
    }
  }

  const addHighlight = (slug: string) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newHighlights = {
      en: [...(subsidiary.highlights.en || []), { title: 'New highlight', body: '' }],
      ar: [...(subsidiary.highlights.ar || []), { title: 'تمييز جديد', body: '' }],
    }
    updateSubsidiary(slug, { highlights: newHighlights })
  }

  const removeHighlight = (slug: string, index: number) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newHighlights = {
      en: subsidiary.highlights.en.filter((_, i) => i !== index),
      ar: subsidiary.highlights.ar.filter((_, i) => i !== index),
    }
    updateSubsidiary(slug, { highlights: newHighlights })
  }

  const updateHighlight = (
    slug: string,
    index: number,
    locale: Locale,
    field: 'title' | 'body',
    value: string,
  ) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newHighlights = { ...subsidiary.highlights }
    newHighlights[locale] = [...newHighlights[locale]]
    newHighlights[locale][index] = { ...newHighlights[locale][index], [field]: value }
    updateSubsidiary(slug, { highlights: newHighlights })
  }

  const addMetric = (slug: string) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newMetrics = {
      en: [...(subsidiary.metrics.en || []), { value: '', label: '' }],
      ar: [...(subsidiary.metrics.ar || []), { value: '', label: '' }],
    }
    updateSubsidiary(slug, { metrics: newMetrics })
  }

  const removeMetric = (slug: string, index: number) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newMetrics = {
      en: subsidiary.metrics.en.filter((_, i) => i !== index),
      ar: subsidiary.metrics.ar.filter((_, i) => i !== index),
    }
    updateSubsidiary(slug, { metrics: newMetrics })
  }

  const updateMetric = (
    slug: string,
    index: number,
    locale: Locale,
    field: 'value' | 'label',
    value: string,
  ) => {
    const subsidiary = subsidiaries.find((s) => s.slug === slug)
    if (!subsidiary) return

    const newMetrics = { ...subsidiary.metrics }
    newMetrics[locale] = [...newMetrics[locale]]
    newMetrics[locale][index] = { ...newMetrics[locale][index], [field]: value }
    updateSubsidiary(slug, { metrics: newMetrics })
  }

  const uploadSubsidiaryImage = async (slug: string, field: 'image' | 'logo', file: File) => {
    const url = await uploadSubsidiaryAsset(slug, field, file)
    updateSubsidiary(slug, { [field]: url } as Partial<ManagedSubsidiary>)
  }

  return (
    <div className="space-y-4">
      <Card
        title="Subsidiaries management"
        description="Edit subsidiary details, images, colors, and contact information."
      >
        <div className="space-y-3">
          {/* Locale toggle */}
          <RadioGroup
            value={locale}
            onChange={(v) => setLocale(v as Locale)}
            options={LOCALES.map((loc) => ({
              value: loc,
              label: loc === 'en' ? 'English' : 'العربية',
              hint: loc === 'en' ? 'Edit content in English' : 'تحرير المحتوى بالعربية',
            }))}
            direction="horizontal"
          />

          {/* Subsidiaries list */}
          <div className="space-y-2">
            {subsidiaries.map((subsidiary, index) => {
              const slugError =
                subsidiary.slug.trim() === ''
                  ? 'Slug is required.'
                  : subsidiaries.filter((s) => s.slug === subsidiary.slug).length > 1
                    ? 'Slug must be unique.'
                    : null
              return (
              <div
                key={index}
                className="rounded-lg border border-border overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() =>
                    setExpandedSlug(expandedSlug === subsidiary.slug ? null : subsidiary.slug)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-colors"
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground">{subsidiary.name[locale]}</p>
                    <p className="text-xs text-muted">{subsidiary.slug}</p>
                  </div>
                  <ChevronDown
                    className={`size-4 transition-transform ${
                      expandedSlug === subsidiary.slug ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Expanded content */}
                {expandedSlug === subsidiary.slug && (
                  <div className="border-t border-border px-4 py-4 space-y-6 bg-surface-sunken">
                    {/* Basic info */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Basic Information</h4>
                      <Field
                        label="URL slug"
                        hint="Public address: /subsidiaries/{slug}. Lowercase letters, numbers and dashes."
                      >
                        <TextInput
                          mono
                          value={subsidiary.slug}
                          onChange={(v) => updateSlug(subsidiary.slug, v)}
                        />
                        {slugError && <p className="mt-1 text-xs text-danger">{slugError}</p>}
                      </Field>
                      <Field label="Name">
                        <TextInput
                          value={subsidiary.name[locale]}
                          onChange={(v) => updateLocalized(subsidiary.slug, 'name', locale, v)}
                        />
                      </Field>
                      <Field label="Tag / Category">
                        <TextInput
                          value={subsidiary.tag[locale]}
                          onChange={(v) => updateLocalized(subsidiary.slug, 'tag', locale, v)}
                        />
                      </Field>
                      <Field label="Short description">
                        <TextArea
                          value={subsidiary.short[locale]}
                          onChange={(v) => updateLocalized(subsidiary.slug, 'short', locale, v)}
                          rows={2}
                        />
                      </Field>
                      <Field label="Established / Founded">
                        <TextInput
                          value={subsidiary.established[locale]}
                          onChange={(v) =>
                            updateLocalized(subsidiary.slug, 'established', locale, v)
                          }
                        />
                      </Field>
                    </div>

                    {/* Detailed content */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Detailed Content</h4>
                      <Field label="Paragraphs (one per line)">
                        <TextArea
                          value={subsidiary.paragraphs[locale].join('\n')}
                          onChange={(v) =>
                            updateLocalized(
                              subsidiary.slug,
                              'paragraphs',
                              locale,
                              v.split('\n').filter((p) => p.trim()),
                            )
                          }
                          rows={4}
                        />
                      </Field>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">Highlights</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addHighlight(subsidiary.slug)}
                        >
                          <Plus className="size-3.5" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {subsidiary.highlights[locale].map((highlight, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-lg border border-border space-y-2 bg-background"
                          >
                            <div className="flex gap-2">
                              <div className="flex-1 space-y-2">
                                <TextInput
                                  value={highlight.title}
                                  onChange={(v) =>
                                    updateHighlight(subsidiary.slug, idx, locale, 'title', v)
                                  }
                                />
                                <TextArea
                                  value={highlight.body}
                                  onChange={(v) =>
                                    updateHighlight(subsidiary.slug, idx, locale, 'body', v)
                                  }
                                  rows={2}
                                />
                              </div>
                              <button
                                onClick={() => removeHighlight(subsidiary.slug, idx)}
                                className="self-start p-1 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">Metrics</h4>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addMetric(subsidiary.slug)}
                        >
                          <Plus className="size-3.5" />
                          Add
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {subsidiary.metrics[locale].map((metric, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-border bg-background items-start"
                          >
                            <TextInput
                              value={metric.value}
                              onChange={(v) =>
                                updateMetric(subsidiary.slug, idx, locale, 'value', v)
                              }
                            />
                            <div className="relative">
                              <TextInput
                                value={metric.label}
                                onChange={(v) =>
                                  updateMetric(subsidiary.slug, idx, locale, 'label', v)
                                }
                              />
                              <button
                                onClick={() => removeMetric(subsidiary.slug, idx)}
                                className="absolute right-2 top-2 p-1 hover:text-destructive transition-colors"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Images & Colors */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground">Visual Assets</h4>
                        <p className="text-xs text-muted">All images can also be edited in the Media tab.</p>
                      </div>

                      <MediaAssetField
                        label="Cover image"
                        hint="Homepage card background and profile page hero."
                        value={subsidiary.image ?? ''}
                        onChange={(v) => updateSubsidiary(subsidiary.slug, { image: v })}
                        onUpload={(file) => uploadSubsidiaryImage(subsidiary.slug, 'image', file)}
                        previewCover
                      />

                      <MediaAssetField
                        label="Company logo"
                        hint="Official logo on cards and profile headers."
                        value={subsidiary.logo ?? ''}
                        onChange={(v) => updateSubsidiary(subsidiary.slug, { logo: v })}
                        onUpload={(file) => uploadSubsidiaryImage(subsidiary.slug, 'logo', file)}
                        previewDark
                      />

                      {/* Colors */}
                      <div className="grid grid-cols-3 gap-3">
                        <Field label="Gradient from">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={subsidiary.visual.from}
                              onChange={(e) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, from: e.target.value },
                                })
                              }
                              className="size-10 rounded cursor-pointer"
                            />
                            <TextInput
                              mono
                              value={subsidiary.visual.from}
                              onChange={(v) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, from: v },
                                })
                              }
                            />
                          </div>
                        </Field>
                        <Field label="Gradient to">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={subsidiary.visual.to}
                              onChange={(e) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, to: e.target.value },
                                })
                              }
                              className="size-10 rounded cursor-pointer"
                            />
                            <TextInput
                              mono
                              value={subsidiary.visual.to}
                              onChange={(v) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, to: v },
                                })
                              }
                            />
                          </div>
                        </Field>
                        <Field label="Glow color">
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={subsidiary.visual.glow}
                              onChange={(e) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, glow: e.target.value },
                                })
                              }
                              className="size-10 rounded cursor-pointer"
                            />
                            <TextInput
                              mono
                              value={subsidiary.visual.glow}
                              onChange={(v) =>
                                updateSubsidiary(subsidiary.slug, {
                                  visual: { ...subsidiary.visual, glow: v },
                                })
                              }
                            />
                          </div>
                        </Field>
                      </div>
                    </div>

                    {/* Icon selection */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Icon</h4>
                      <RadioGroup
                        value={subsidiary.icon}
                        onChange={(v) =>
                          updateSubsidiary(subsidiary.slug, { icon: v })
                        }
                        options={ICON_PRESETS.map((icon) => ({
                          value: icon,
                          label: icon,
                          hint: `Lucide icon: ${icon}`,
                        }))}
                        direction="horizontal"
                      />
                    </div>

                    {/* Contact info */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Contact Information</h4>
                      <Field label="Address">
                        <TextArea
                          value={subsidiary.contact.address[locale]}
                          onChange={(v) => {
                            const newContact = { ...subsidiary.contact }
                            newContact.address = { ...newContact.address, [locale]: v }
                            updateSubsidiary(subsidiary.slug, { contact: newContact })
                          }}
                          rows={2}
                        />
                      </Field>
                      <Field label="Phone">
                        <TextInput
                          value={subsidiary.contact.phone || ''}
                          onChange={(v) => {
                            const newContact = { ...subsidiary.contact, phone: v || undefined }
                            updateSubsidiary(subsidiary.slug, { contact: newContact })
                          }}
                        />
                      </Field>
                      <Field label="Fax">
                        <TextInput
                          value={subsidiary.contact.fax || ''}
                          onChange={(v) => {
                            const newContact = { ...subsidiary.contact, fax: v || undefined }
                            updateSubsidiary(subsidiary.slug, { contact: newContact })
                          }}
                        />
                      </Field>
                      <Field label="Email">
                        <TextInput
                          value={subsidiary.contact.email || ''}
                          onChange={(v) => {
                            const newContact = { ...subsidiary.contact, email: v || undefined }
                            updateSubsidiary(subsidiary.slug, { contact: newContact })
                          }}
                        />
                      </Field>
                    </div>

                    {/* Website & Profile */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-foreground">Links & Settings</h4>
                      <Field label="Website URL">
                        <TextInput
                          mono
                          value={subsidiary.website}
                          onChange={(v) => updateSubsidiary(subsidiary.slug, { website: v })}
                        />
                      </Field>
                      <Toggle
                        checked={subsidiary.hasProfile}
                        onChange={() =>
                          updateSubsidiary(subsidiary.slug, { hasProfile: !subsidiary.hasProfile })
                        }
                        label="Has detailed profile page"
                      />
                    </div>

                    {/* Danger zone */}
                    <div className="border-t border-border pt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPendingDeleteSlug(subsidiary.slug)}
                      >
                        <Trash2 className="size-4" />
                        Delete subsidiary
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              )
            })}
          </div>

          {/* Add subsidiary */}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted transition-colors hover:border-brand hover:bg-brand-muted hover:text-brand"
          >
            <Plus className="size-4" />
            Add subsidiary
          </button>

          {/* Enable/disable toggle */}
          <div className="pt-3 border-t border-border">
            <Toggle
              checked={payload.subsidiaries?.enabled ?? true}
              onChange={() =>
                setSubsidiaries({
                  enabled: !(payload.subsidiaries?.enabled ?? true),
                  items: subsidiaries,
                })
              }
              label="Show subsidiaries section on homepage"
            />
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={pendingDeleteSlug !== null}
        onOpenChange={(open) => !open && setPendingDeleteSlug(null)}
        title="Delete subsidiary?"
        description={
          pendingDelete
            ? `"${pendingDelete.name.en || pendingDelete.slug}" will be removed from the homepage, the subsidiaries list, and its profile page once you save. This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => pendingDeleteSlug && removeSubsidiary(pendingDeleteSlug)}
      />

      <AddSubsidiaryDialog
        open={addOpen}
        existingSlugs={subsidiaries.map((s) => s.slug)}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
