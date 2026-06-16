'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Building2,
  Cpu,
  Flower2,
  Package,
  Plus,
  ShieldCheck,
  Sprout,
  X,
  type LucideIcon,
} from 'lucide-react'
import { ICON_PRESETS } from '@/lib/types'
import { slugify } from '@/lib/slug'
import { cn } from '@/lib/utils'
import { Field, TextArea, TextInput } from '../editor/inputs'
import { Button } from '../ui/button'

/** What the dialog hands back to the section to build a full subsidiary. */
export type NewSubsidiaryDraft = {
  nameEn: string
  nameAr: string
  slug: string
  tagEn: string
  shortEn: string
  icon: string
}

const ICON_COMPONENTS: Record<(typeof ICON_PRESETS)[number], LucideIcon> = {
  Package,
  Cpu,
  ShieldCheck,
  Flower2,
  Building2,
  Sprout,
}

export function AddSubsidiaryDialog({
  open,
  existingSlugs,
  onClose,
  onCreate,
}: {
  open: boolean
  existingSlugs: string[]
  onClose: () => void
  onCreate: (draft: NewSubsidiaryDraft) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  const [nameEn, setNameEn] = useState('')
  const [nameAr, setNameAr] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [tagEn, setTagEn] = useState('')
  const [shortEn, setShortEn] = useState('')
  const [icon, setIcon] = useState<string>(ICON_PRESETS[0])

  // Keep the slug in lock-step with the name until the user edits it by hand.
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn))
  }, [nameEn, slugTouched])

  // Drive the native <dialog>, and reset the form each time it opens.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setNameEn('')
      setNameAr('')
      setSlug('')
      setSlugTouched(false)
      setTagEn('')
      setShortEn('')
      setIcon(ICON_PRESETS[0])
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const slugError =
    slug.trim() === ''
      ? nameEn.trim()
        ? 'Enter a slug.'
        : null
      : existingSlugs.includes(slug)
        ? 'This slug is already in use.'
        : null

  const canCreate = nameEn.trim() !== '' && slug.trim() !== '' && !slugError

  const submit = () => {
    if (!canCreate) return
    onCreate({
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      slug,
      tagEn: tagEn.trim(),
      shortEn: shortEn.trim(),
      icon,
    })
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      className="m-auto w-full max-w-lg rounded-2xl border border-border bg-surface p-0 shadow-2xl backdrop:bg-foreground/50 backdrop:backdrop-blur-sm open:animate-in"
    >
      {/* Stunning header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand to-[#7a1f3a] px-6 py-5 text-white">
        <div
          className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20 backdrop-blur">
            <Building2 className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight">Add a subsidiary</h2>
            <p className="mt-0.5 text-sm text-white/80">
              Just the essentials — add images, colours and full details afterwards.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute end-4 top-4 rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="space-y-4 px-6 py-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name (English)">
            <TextInput value={nameEn} onChange={setNameEn} placeholder="e.g. Flora Logistics" />
          </Field>
          <Field label="Name (Arabic)">
            <TextInput dir="rtl" value={nameAr} onChange={setNameAr} placeholder="فلورا للخدمات اللوجستية" />
          </Field>
        </div>

        <Field label="URL slug" hint="Lowercase letters, numbers and dashes.">
          <TextInput
            mono
            value={slug}
            onChange={(v) => {
              setSlugTouched(true)
              setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }}
            placeholder="flora-logistics"
          />
          <div className="mt-1.5 flex items-center justify-between gap-3">
            <span className="truncate text-xs text-subtle">
              /subsidiaries/<span className="text-foreground">{slug || '…'}</span>
            </span>
            {slugError && <span className="shrink-0 text-xs text-danger">{slugError}</span>}
          </div>
        </Field>

        <Field label="Category / tag">
          <TextInput value={tagEn} onChange={setTagEn} placeholder="e.g. Logistics & Distribution" />
        </Field>

        <Field label="Short description">
          <TextArea
            value={shortEn}
            onChange={setShortEn}
            rows={2}
          />
        </Field>

        <Field label="Icon">
          <div className="flex flex-wrap gap-2">
            {ICON_PRESETS.map((name) => {
              const Icon = ICON_COMPONENTS[name]
              const selected = icon === name
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIcon(name)}
                  aria-pressed={selected}
                  aria-label={name}
                  className={cn(
                    'grid size-10 place-items-center rounded-lg border transition-colors',
                    selected
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-border text-muted hover:border-brand hover:text-brand',
                  )}
                >
                  <Icon className="size-5" />
                </button>
              )
            })}
          </div>
        </Field>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!canCreate}>
            <Plus className="size-4" />
            Add subsidiary
          </Button>
        </div>
      </form>
    </dialog>
  )
}
