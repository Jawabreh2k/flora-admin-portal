'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Check, History, Loader2, RotateCcw, Save } from 'lucide-react'
import type {
  Branding,
  EditableContent,
  Images,
  Locale,
  Sections,
  Social,
  Theme,
  UiConfigPayload,
  UiConfigResponse,
} from '@/lib/types'
import { CONTENT_SCHEMA } from '@/lib/types'
import { validateUiConfig } from '@/lib/validation'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  ConfigSectionNav,
  getConfigSection,
  type ConfigSectionId,
} from '@/components/config-section-nav'
import { AppearanceSection } from './sections/appearance-section'
import { BrandingSection } from './sections/branding-section'
import { ContentSection } from './sections/content-section'
import { MediaSection } from './sections/media-section'
import { LayoutSection } from './sections/layout-section'
import { SubsidiariesSection } from './sections/subsidiaries-section'
import { SocialSection } from './sections/social-section'
import { EmailSection } from './sections/email-section'
import { SectionPreview } from './section-preview'
import { RevisionHistoryDialog, type RestoreResult } from './revision-history-dialog'

type SaveState =
  | { status: 'idle' }
  | { status: 'saving' }
  | { status: 'saved'; revision: number; revalidated: boolean }
  | { status: 'error'; message: string }

export function ConfigEditor({ initial }: { initial: UiConfigResponse }) {
  const router = useRouter()
  const [active, setActive] = useState<ConfigSectionId>('appearance')
  const [payload, setPayload] = useState<UiConfigPayload>(initial.payload)
  const [save, setSave] = useState<SaveState>({ status: 'idle' })
  const [dirty, setDirty] = useState(false)
  // Which palette the Appearance editor (and its live preview) currently targets.
  const [themeVariant, setThemeVariant] = useState<'light' | 'dark'>('light')
  const [contentLocale, setContentLocale] = useState<Locale>('en')
  const [emailLocale, setEmailLocale] = useState<Locale>('en')
  const [contentPage, setContentPage] = useState<string>(CONTENT_SCHEMA[0].page)
  // Links Appearance colour fields ↔ the live preview (hover one, spotlight the other).
  const [hoverToken, setHoverToken] = useState<keyof Theme | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)
  // Live revision number, kept current as the admin saves or restores.
  const [revision, setRevision] = useState(initial.revision)

  const activeSection = getConfigSection(active)

  // Block saving while the payload has problems (e.g. missing / duplicate slugs).
  const validationErrors = useMemo(() => validateUiConfig(payload), [payload])
  const canSave = dirty && save.status !== 'saving' && validationErrors.length === 0

  const touched = () => {
    setDirty(true)
    setSave({ status: 'idle' })
  }

  const setTheme = (key: keyof Theme, value: string) => {
    const field = themeVariant === 'dark' ? 'themeDark' : 'theme'
    setPayload((p) => ({ ...p, [field]: { ...p[field], [key]: value } }))
    touched()
  }
  const applyTheme = (patch: Partial<Theme>) => {
    const field = themeVariant === 'dark' ? 'themeDark' : 'theme'
    setPayload((p) => ({ ...p, [field]: { ...p[field], ...patch } }))
    touched()
  }
  // Shape & typography (radius/fonts) are shared across both palettes — always
  // targets the light theme object regardless of which variant is selected above.
  const setSharedTheme = (key: keyof Theme, value: string) => {
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
  const setSubsidiaries = (subsidiaries: UiConfigPayload['subsidiaries']) => {
    setPayload((p) => ({ ...p, subsidiaries }))
    touched()
  }
  const setSocial = (social: Social) => {
    setPayload((p) => ({ ...p, social }))
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
    if (validationErrors.length > 0) {
      setSave({ status: 'error', message: 'Resolve the highlighted issues before saving.' })
      return
    }
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
      setRevision(data.revision)
      setSave({ status: 'saved', revision: data.revision, revalidated: !!data.revalidated })
    } catch {
      setSave({ status: 'error', message: 'Network error.' })
    }
  }

  function onRestored(result: RestoreResult) {
    setPayload(result.payload)
    setDirty(false)
    setRevision(result.revision)
    setSave({ status: 'saved', revision: result.revision, revalidated: !!result.revalidated })
    setHistoryOpen(false)
  }

  return (
    <div className="-mx-4 -mt-2 flex min-h-[calc(100dvh-3.5rem)] flex-col sm:-mx-6 lg:-mx-8 lg:-mt-4">
      {/* Toolbar */}
      <div className="sticky top-0 z-30 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {activeSection.label}
            </h1>
            <p className="mt-0.5 text-sm text-muted">{activeSection.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden text-xs text-subtle sm:inline">
              Rev {revision}
            </span>
            {dirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-1 text-xs font-medium text-warning">
                <span className="size-1.5 rounded-full bg-warning" />
                Unsaved
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setHistoryOpen(true)}>
              <History className="size-3.5" />
              History
            </Button>
            <Button variant="outline" size="sm" onClick={reset} disabled={!dirty}>
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={onSave}
              disabled={!canSave}
              title={
                validationErrors.length > 0
                  ? 'Resolve the highlighted issues before saving'
                  : undefined
              }
            >
              {save.status === 'saving' ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="border-b border-border px-4 py-2.5 sm:px-6 lg:px-8">
          <Alert variant="danger">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">
                Resolve {validationErrors.length} issue{validationErrors.length > 1 ? 's' : ''} before saving:
              </p>
              <ul className="list-disc space-y-0.5 ps-5 text-sm">
                {validationErrors.slice(0, 6).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
              {validationErrors.length > 6 && (
                <p className="text-sm">…and {validationErrors.length - 6} more.</p>
              )}
              <button
                type="button"
                onClick={() => setActive('subsidiaries')}
                className="text-sm font-medium underline underline-offset-2 hover:opacity-80"
              >
                Go to Subsidiaries
              </button>
            </div>
          </Alert>
        </div>
      )}

      {save.status === 'saved' && (
        <div className="border-b border-border px-4 py-2.5 sm:px-6 lg:px-8">
          <Alert variant="success">
            <Check className="mt-0.5 size-4 shrink-0" />
            <span>
              Published — revision {save.revision}.{' '}
              {save.revalidated
                ? 'Public site refreshed instantly.'
                : 'Public site will refresh within its cache window.'}
            </span>
          </Alert>
        </div>
      )}
      {save.status === 'error' && (
        <div className="border-b border-border px-4 py-2.5 sm:px-6 lg:px-8">
          <Alert variant="danger">{save.message}</Alert>
        </div>
      )}

      <RevisionHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        onRestored={onRestored}
      />

      {/* Workspace */}
      <div className="flex-1 bg-surface-sunken">
        <div className="grid gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:px-8 lg:py-6 xl:grid-cols-[200px_minmax(0,1fr)_300px]">
          <ConfigSectionNav active={active} onChange={setActive} />

          <div className="min-w-0 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            {active === 'appearance' && (
              <AppearanceSection
                payload={payload}
                setTheme={setTheme}
                applyTheme={applyTheme}
                setSharedTheme={setSharedTheme}
                activeToken={hoverToken}
                onHoverToken={setHoverToken}
                themeVariant={themeVariant}
                onThemeVariantChange={setThemeVariant}
              />
            )}
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
            {active === 'media' && (
              <MediaSection
                payload={payload}
                setImage={setImage}
                setBranding={setBranding}
                setSubsidiaries={setSubsidiaries}
              />
            )}
            {active === 'branding' && (
              <BrandingSection payload={payload} setBranding={setBranding} />
            )}
            {active === 'email' && (
              <EmailSection
                payload={payload}
                locale={emailLocale}
                onLocaleChange={setEmailLocale}
                setContent={setContent}
              />
            )}
            {active === 'social' && (
              <SocialSection payload={payload} setSocial={setSocial} />
            )}
            {active === 'subsidiaries' && (
              <SubsidiariesSection payload={payload} setSubsidiaries={setSubsidiaries} />
            )}
            {active === 'layout' && (
              <LayoutSection payload={payload} toggleSection={toggleSection} />
            )}
          </div>

          <div className="hidden xl:block">
            <div className="sticky top-24 rounded-2xl border border-border bg-surface shadow-sm">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>
                <p className="text-xs font-medium text-subtle">Live preview</p>
              </div>
              <div className="p-4">
                <SectionPreview
                  active={active}
                  payload={payload}
                  contentPage={contentPage}
                  contentLocale={contentLocale}
                  emailLocale={emailLocale}
                  activeToken={hoverToken}
                  onHoverToken={(k) => setHoverToken(k as keyof Theme | null)}
                  themeVariant={themeVariant}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
