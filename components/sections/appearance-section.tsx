'use client'

import { useState, type CSSProperties } from 'react'
import { Check, Copy, Moon, MousePointerClick, Palette, RotateCcw, Sparkles, Sun } from 'lucide-react'
import type { Theme, UiConfigPayload } from '@/lib/types'
import {
  COLOR_GROUPS,
  DEFAULT_DARK_THEME,
  DEFAULT_THEME,
  matchPreset,
  PRESET_SWATCH_KEYS,
  THEME_PRESETS,
  TOKEN_META,
} from '@/lib/theme-tokens'
import { cn } from '@/lib/utils'
import { ColorField } from '../color-field'
import { Card, Field, RadioGroup, TextInput } from '../editor/inputs'

type ThemeVariant = 'light' | 'dark'

export function AppearanceSection({
  payload,
  setTheme,
  applyTheme,
  setSharedTheme,
  activeToken,
  onHoverToken,
  themeVariant,
  onThemeVariantChange,
}: {
  payload: UiConfigPayload
  setTheme: (key: keyof Theme, value: string) => void
  /** Apply many tokens at once (presets, reset). */
  applyTheme: (patch: Partial<Theme>) => void
  /** Radius/fonts — always writes the light theme regardless of the active variant. */
  setSharedTheme: (key: keyof Theme, value: string) => void
  activeToken?: keyof Theme | null
  onHoverToken?: (key: keyof Theme | null) => void
  themeVariant: ThemeVariant
  onThemeVariantChange: (variant: ThemeVariant) => void
}) {
  const hover = onHoverToken ?? (() => {})
  const [copied, setCopied] = useState(false)
  const isDark = themeVariant === 'dark'
  const activeTheme = isDark ? payload.themeDark : payload.theme
  const defaultTheme = isDark ? DEFAULT_DARK_THEME : DEFAULT_THEME
  const activePreset = !isDark ? matchPreset(payload.theme) : null

  function copyPalette() {
    const json = JSON.stringify(activeTheme, null, 2)
    navigator.clipboard
      ?.writeText(json)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      })
      .catch(() => {})
  }

  return (
    <div className="space-y-6">
      {/* Light / Dark switch */}
      <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">Which palette?</h2>
            <p className="mt-0.5 text-xs text-muted">
              The public site and admin portal both ship a dark mode toggle — every colour below
              is independently editable for each.
            </p>
          </div>
          <div className="inline-flex rounded-xl border border-border bg-surface-sunken p-1">
            <button
              type="button"
              onClick={() => onThemeVariantChange('light')}
              aria-pressed={!isDark}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                !isDark ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground',
              )}
            >
              <Sun className="size-3.5" />
              Light
            </button>
            <button
              type="button"
              onClick={() => onThemeVariantChange('dark')}
              aria-pressed={isDark}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                isDark ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground',
              )}
            >
              <Moon className="size-3.5" />
              Dark
            </button>
          </div>
        </div>
      </section>

      {/* Presets — light theme only; the curated palettes aren't designed for dark surfaces */}
      {!isDark && (
        <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Palette className="size-4 text-brand" />
                Theme presets
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                One click recolours the whole site. Fine-tune individual colours below.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={copyPalette}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
              >
                {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy palette'}
              </button>
              <button
                type="button"
                onClick={() => applyTheme(defaultTheme)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Reset to default
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {THEME_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyTheme(preset.colors)}
                  aria-pressed={isActive}
                  className={cn(
                    'group relative flex flex-col gap-2.5 rounded-xl border p-3 text-left transition-all hover:shadow-sm',
                    isActive
                      ? 'border-brand bg-brand-muted/30 ring-2 ring-brand/20'
                      : 'border-border hover:border-border-strong',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{preset.label}</span>
                    {preset.note && (
                      <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-subtle">
                        {preset.note}
                      </span>
                    )}
                    {isActive && <Check className="ml-auto size-4 text-brand" />}
                  </div>
                  <div className="flex h-7 overflow-hidden rounded-lg ring-1 ring-black/5">
                    {PRESET_SWATCH_KEYS.map((key) => (
                      <span key={key} className="flex-1" style={{ background: preset.colors[key] }} />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {isDark && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs text-muted">
            Editing the <strong className="font-medium text-foreground">dark</strong> palette —
            applies wherever a visitor or admin has dark mode on.
          </p>
          <button
            type="button"
            onClick={() => applyTheme(defaultTheme)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset to default
          </button>
        </div>
      )}

      {/* How-to banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-border bg-gradient-to-br from-brand-muted/70 via-surface to-gold-soft/30 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-white shadow-sm">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Fine-tune every colour</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
            <MousePointerClick className="size-3.5 text-brand" />
            Hover a colour to spotlight where it appears in the live preview. Text colours show a live WCAG contrast score.
          </p>
        </div>
      </div>

      {/* Colour groups */}
      {COLOR_GROUPS.map((group) => (
        <Card key={group.label} title={`${group.label} colours`} description={group.hint}>
          <div className="-mx-2 space-y-0.5">
            {group.keys.map((key) => {
              const meta = TOKEN_META[key]
              const pairValue = meta.pairWith ? activeTheme[meta.pairWith] : undefined
              return (
                <ColorField
                  key={key}
                  token={key}
                  meta={meta}
                  value={activeTheme[key]}
                  pairValue={pairValue}
                  defaultValue={defaultTheme[key]}
                  active={activeToken === key}
                  onChange={(v) => setTheme(key, v)}
                  onHover={(on) => hover(on ? key : null)}
                />
              )
            })}
          </div>
        </Card>
      ))}

      {/* Shape & typography — shared across both palettes, always edits the light theme */}
      <Card
        title="Shape & typography"
        description="Corner rounding and the fonts used across the site. Shared between light and dark — not theme-specific."
      >
        <div className="space-y-5">
          <div
            onMouseEnter={() => hover('radius')}
            onMouseLeave={() => hover(null)}
            className="flex flex-col gap-4 rounded-xl border border-border bg-surface-sunken/50 p-4 sm:flex-row sm:items-center"
          >
            <RadiusPreview radius={payload.theme.radius} />
            <div className="min-w-0 flex-1">
              <Field label="Corner radius (CSS length)" hint="e.g. 0.625rem, 12px, 0 for sharp corners">
                <TextInput mono value={payload.theme.radius} onChange={(v) => setSharedTheme('radius', v)} />
              </Field>
            </div>
          </div>

          <Field label="Heading font" hint="Used for titles and display text">
            <TextInput value={payload.theme.fontHeading} onChange={(v) => setSharedTheme('fontHeading', v)} />
            <FontPreview family={payload.theme.fontHeading} className="mt-2 text-xl font-semibold" />
          </Field>

          <Field label="Body font" hint="Used for paragraphs and UI text">
            <TextInput value={payload.theme.fontSans} onChange={(v) => setSharedTheme('fontSans', v)} />
            <FontPreview family={payload.theme.fontSans} className="mt-2 text-sm" />
          </Field>
        </div>
      </Card>
    </div>
  )
}

function RadiusPreview({ radius }: { radius: string }) {
  const style = { '--r': radius || '0px' } as CSSProperties
  return (
    <div style={style} className="flex shrink-0 items-end gap-2">
      <span
        className="grid size-16 place-items-center border-2 border-brand bg-brand-muted text-[10px] font-medium text-brand"
        style={{ borderRadius: 'var(--r)' }}
      >
        {radius || '0'}
      </span>
      <span
        className="grid h-9 place-items-center bg-brand px-3 text-[11px] font-medium text-white"
        style={{ borderRadius: 'var(--r)' }}
      >
        Button
      </span>
    </div>
  )
}

function FontPreview({ family, className }: { family: string; className?: string }) {
  return (
    <p className={className} style={{ fontFamily: family ? `${family}, system-ui, sans-serif` : undefined }}>
      The quick brown fox · 1234
    </p>
  )
}
