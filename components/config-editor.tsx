'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Check,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Palette,
  RotateCcw,
  Save,
  Type,
  Tag,
} from 'lucide-react'
import type {
  Branding,
  EditableContent,
  Images,
  Locale,
  Sections,
  Theme,
  UiConfigPayload,
  UiConfigResponse,
} from '@/lib/types'
import { CONTENT_SCHEMA } from '@/lib/types'
import { cn } from '@/lib/utils'
import { PageHeader } from '@/components/page-header'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AppearanceSection } from './sections/appearance-section'
import { BrandingSection } from './sections/branding-section'
import { ContentSection } from './sections/content-section'
import { MediaSection } from './sections/media-section'
import { LayoutSection } from './sections/layout-section'
import { SectionPreview } from './section-preview'

type SectionId = 'appearance' | 'content' | 'media' | 'branding' | 'layout'

const SECTIONS: { id: SectionId; label: string; icon: typeof Palette; description: string }[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Colors & typography' },
  { id: 'content', label: 'Content', icon: Type, description: 'Page copy & text' },
  { id: 'media', label: 'Media', icon: ImageIcon, description: 'Images & assets' },
  { id: 'branding', label: 'Branding', icon: Tag, description: 'Site metadata' },
  { id: 'layout', label: 'Layout', icon: LayoutGrid, description: 'Section visibility' },
]

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; revision: number; revalidated: boolean }
  | { status: 'error'; message: string }

export function ConfigEditor({ initial }: { initial: UiConfigResponse }) {
  const router = useRouter()
  const [active, setActive] = useState<SectionId>('appearance')
  const [payload, setPayload] = useState<UiConfigPayload>(initial.payload)
  const [save, setSave] = useState<SaveState>({ status: 'idle' })
  const [dirty, setDirty] = useState(false)
  const [contentLocale, setContentLocale] = useState<Locale>('en')
  const [contentPage, setContentPage] = useState<string>(CONTENT_SCHEMA[0].page)

  const activeSection = SECTIONS.find((s) => s.id === active)!

  const touched = () => {
    setDirty(true)
    setSave({ status: 'idle' })
  }

  const setTheme = (key: keyof Theme, value: string) => {
    setPayload((p) => ({ ...p, theme: { ...p.theme, [key]: value } }))
    touched()
  }
  const setBranding = (key: keyof Branding, value: string) => {
    setPayload((p) => ({ ...p, branding: { ...p.branding, [key]: value } }))
    touched()
  }
  const setImage = (key: keyof Images, value: string) => {
    setPayload((p) => ({ ...p, images: { ...p.images, [key]: value } }))
    touched()
  }
  const toggleSection = (key: keyof Sections) => {
    setPayload((p) => ({ ...p, sections: { ...p.sections, [key]: !p.sections[key] } }))
    touched()
  }
  const setContent = (locale: Locale, group: keyof EditableContent, key: string, value: string) => {
    setPayload((p) => ({
      ...p,
      content: {
        ...p.content,
        [locale]: {
          ...p.content[locale],
          [group]: { ...p.content[locale][group], [key]: value },
        },
      },
    }))
    touched()
  }

  function reset() {
    setPayload(initial.payload)
    setDirty(false)
    setSave({ status: 'idle' })
  }

  async function onSave() {
    setSave({ status: 'saving' })
    try {
      const res = await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 401) {
          router.replace('/login')
          return
        }
        setSave({ status: 'error', message: data.error ?? 'Save failed.' })
        return
      }
      setDirty(false)
      setSave({ status: 'saved', revision: data.revision, revalidated: !!data.revalidated })
    } catch {
      setSave({ status: 'error', message: 'Network error.' })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site configuration"
        description="Customize your public website's appearance, content, and layout. Changes are published when you save."
        breadcrumbs={[{ label: 'Site Config' }]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reset} disabled={!dirty}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button size="sm" onClick={onSave} disabled={save.status === 'saving' || !dirty}>
              {save.status === 'saving' ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save & publish
            </Button>
          </>
        }
      />

      {/* Status bar */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
        <span>Revision {initial.revision}</span>
        {initial.updatedBy && <span>Last saved by {initial.updatedBy}</span>}
        {dirty && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-0.5 font-medium text-warning">
            <span className="size-1.5 rounded-full bg-warning" />
            Unsaved changes
          </span>
        )}
      </div>

      {save.status === 'saved' && (
        <Alert variant="success">
          <Check className="mt-0.5 size-4 shrink-0" />
          <span>
            Published — revision {save.revision}.{' '}
            {save.revalidated
              ? 'Public site refreshed instantly.'
              : 'Public site will refresh within its cache window.'}
          </span>
        </Alert>
      )}
      {save.status === 'error' && <Alert variant="danger">{save.message}</Alert>}

      {/* Editor layout */}
      <div className="grid gap-6 lg:grid-cols-[220px_1fr] xl:grid-cols-[220px_1fr_320px]">
        {/* Section nav */}
        <nav className="space-y-1">
          {/* Mobile select */}
          <select
            value={active}
            onChange={(e) => setActive(e.target.value as SectionId)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm lg:hidden"
          >
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <div className="hidden space-y-1 lg:block">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActive(section.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150',
                  active === section.id
                    ? 'bg-brand-muted text-brand shadow-sm ring-1 ring-brand/10'
                    : 'text-muted hover:bg-surface hover:text-foreground',
                )}
              >
                <section.icon className="size-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{section.label}</span>
                  <span className="block truncate text-[11px] text-subtle">{section.description}</span>
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* Form area */}
        <div className="min-w-0 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-1 shadow-sm lg:hidden">
            <p className="px-4 py-2 text-sm font-medium text-foreground">{activeSection.label}</p>
            <p className="px-4 pb-2 text-xs text-muted">{activeSection.description}</p>
          </div>

          {active === 'appearance' && <AppearanceSection payload={payload} setTheme={setTheme} />}
          {active === 'content' && (
            <ContentSection
              payload={payload}
              setContent={setContent}
              locale={contentLocale}
              onLocaleChange={setContentLocale}
              activePage={contentPage}
              onPageChange={setContentPage}
            />
          )}
          {active === 'media' && <MediaSection payload={payload} setImage={setImage} />}
          {active === 'branding' && <BrandingSection payload={payload} setBranding={setBranding} />}
          {active === 'layout' && <LayoutSection payload={payload} toggleSection={toggleSection} />}
        </div>

        {/* Preview panel */}
        <div className="hidden xl:block">
          <div className="sticky top-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">Live preview</p>
            <SectionPreview
              active={active}
              payload={payload}
              contentPage={contentPage}
              contentLocale={contentLocale}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
