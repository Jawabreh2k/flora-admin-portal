'use client'

import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { ImageOff } from 'lucide-react'
import type { Locale, Theme, UiConfigPayload } from '@/lib/types'
import { cn } from '@/lib/utils'

type SectionId = 'appearance' | 'content' | 'media' | 'branding' | 'email' | 'social' | 'layout' | 'subsidiaries'

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const THEME_KEYS: (keyof Theme)[] = [
  'background', 'foreground', 'card', 'cardForeground', 'primary', 'primaryForeground',
  'secondary', 'secondaryForeground', 'muted', 'mutedForeground', 'accent', 'accentForeground',
  'border', 'input', 'ring', 'destructive', 'gold', 'goldSoft', 'goldForeground',
  'maroon', 'maroonDeep', 'radius',
]

const toCssVar = (key: string) => `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`

function themeVars(theme: Theme): CSSProperties {
  const style: Record<string, string> = {}
  for (const key of THEME_KEYS) {
    const v = theme[key]
    if (typeof v === 'string' && v) style[toCssVar(key)] = v
  }
  return style as CSSProperties
}

function resolveSrc(src: string): string {
  if (!src) return ''
  if (/^https?:\/\//.test(src) || src.startsWith('data:')) return src
  return `${PUBLIC_SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

// ─── Shared image fallback ────────────────────────────────────────────────────

function Img({ src, alt, className, dark }: { src: string; alt: string; className?: string; dark?: boolean }) {
  const [error, setError] = useState(false)
  const resolved = resolveSrc(src)

  useEffect(() => { setError(false) }, [src])

  if (resolved && !error) {
    return (
      <img
        src={resolved}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
    )
  }
  return (
    <div className={cn('grid place-items-center', dark ? 'bg-white/10' : 'bg-neutral-100', className)}>
      <span className={cn('flex flex-col items-center gap-1 text-[10px]', dark ? 'text-white/40' : 'text-neutral-400')}>
        <ImageOff className="size-4" />
        {src && error ? 'Cannot load' : 'No image'}
      </span>
    </div>
  )
}

// ─── Appearance ──────────────────────────────────────────────────────────────

function AppearancePreview({ payload }: { payload: UiConfigPayload }) {
  return (
    <div style={themeVars(payload.theme)} className="overflow-hidden rounded-[var(--radius)] border">
      <div className="px-5 py-6" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
        <span
          className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium"
          style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
        >
          Qatari Conglomerate · Since 1993
        </span>
        <h3 className="mt-3 text-lg font-semibold leading-tight">
          A legacy of excellence,{' '}
          <span style={{ color: 'var(--gold)' }}>redefining industries</span> across Qatar.
        </h3>
        <div className="mt-4 flex gap-2">
          <span
            className="rounded-[var(--radius)] px-3 py-1.5 text-xs font-medium"
            style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
          >
            Explore Subsidiaries
          </span>
          <span
            className="rounded-[var(--radius)] border px-3 py-1.5 text-xs font-medium"
            style={{ borderColor: 'var(--primary-foreground)', opacity: 0.85 }}
          >
            Corporate Profile
          </span>
        </div>
      </div>
      <div className="px-5 py-5" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <div
          className="rounded-[var(--radius)] border p-4"
          style={{ background: 'var(--card)', color: 'var(--card-foreground)', borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Strategic Verticals</p>
          <p className="mt-1 text-2xl font-bold" style={{ color: 'var(--primary)' }}>6</p>
        </div>
        <button
          className="mt-4 w-full rounded-[var(--radius)] py-2 text-xs font-medium"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          Get in Touch
        </button>
      </div>
    </div>
  )
}

// ─── Content ─────────────────────────────────────────────────────────────────

function ContentPreview({
  payload,
  activePage,
  locale,
}: {
  payload: UiConfigPayload
  activePage: string
  locale: Locale
}) {
  const vars = themeVars(payload.theme)
  const c = payload.content[locale]
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <div style={vars} className="overflow-hidden rounded-[var(--radius)] border text-[11px]" dir={dir}>

      {activePage === 'Homepage' && (
        <>
          {/* Hero */}
          <div className="px-4 py-5" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[9px] font-medium"
              style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
            >
              {c.hero.badge || 'Badge'}
            </span>
            <p className="mt-2 font-semibold leading-snug">
              {c.hero.titleA || 'Title A'}{' '}
              <span style={{ color: 'var(--gold)' }}>{c.hero.titleHighlight || 'Highlight'}</span>{' '}
              {c.hero.titleB || 'Title B'}
            </p>
            <p className="mt-1 text-[10px] opacity-75 line-clamp-2">{c.hero.subtitle || 'Subtitle...'}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span
                className="rounded-[var(--radius)] px-2.5 py-1 text-[10px] font-medium"
                style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
              >
                {c.hero.ctaExplore || 'Explore'}
              </span>
              <span
                className="rounded-[var(--radius)] border px-2.5 py-1 text-[10px] font-medium opacity-80"
                style={{ borderColor: 'var(--primary-foreground)' }}
              >
                {c.hero.ctaProfile || 'Profile'}
              </span>
            </div>
          </div>
          {/* Subsidiaries */}
          <div className="border-t px-4 py-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
            <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: 'var(--gold)' }}>
              {c.subsidiaries.eyebrow || 'Eyebrow'}
            </p>
            <p className="mt-0.5 font-semibold" style={{ color: 'var(--foreground)' }}>
              {c.subsidiaries.title || 'Subsidiaries'}
            </p>
            <p className="mt-0.5 text-[10px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {c.subsidiaries.description || 'Description...'}
            </p>
          </div>
          {/* Spotlight */}
          <div className="border-t px-4 py-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: 'var(--gold)' }}>
              {c.spotlight.eyebrow || 'Eyebrow'}
            </p>
            <p className="mt-0.5 font-semibold" style={{ color: 'var(--card-foreground)' }}>
              {c.spotlight.title || 'Spotlight'}
            </p>
            <p className="mt-0.5 text-[10px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {c.spotlight.description || 'Description...'}
            </p>
          </div>
        </>
      )}

      {activePage === 'Footer' && (
        <>
          {/* Careers band */}
          <div className="px-4 py-5" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
            <p className="font-semibold">{c.footer.careersTitle || 'Join Our Team'}</p>
            <p className="mt-1 text-[10px] opacity-75 line-clamp-2">{c.footer.careersBody || 'Careers body...'}</p>
            <span
              className="mt-2 inline-block rounded-[var(--radius)] px-2.5 py-1 text-[10px] font-medium"
              style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
            >
              {c.footer.exploreCareers || 'Explore Careers'}
            </span>
          </div>
          {/* About strip */}
          <div className="border-t px-4 py-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
            <p className="text-[10px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {c.footer.about || 'About text...'}
            </p>
            <p className="mt-1.5 text-[10px]" style={{ color: 'var(--foreground)' }}>
              📍 {c.footer.address || 'Office address'}
            </p>
            {(c.footer.phoneDisplay || c.footer.email) && (
              <p className="mt-1 text-[9px]" style={{ color: 'var(--muted-foreground)' }}>
                {c.footer.phoneDisplay && <span>{c.footer.phoneDisplay}</span>}
                {c.footer.phoneDisplay && c.footer.email && ' · '}
                {c.footer.email && <span>{c.footer.email}</span>}
              </p>
            )}
            <p className="mt-1 text-[9px]" style={{ color: 'var(--muted-foreground)' }}>
              {c.footer.newsletter || 'Newsletter prompt'}
            </p>
          </div>
          {/* Bottom bar */}
          <div className="border-t px-4 py-2" style={{ background: 'var(--maroon)', borderColor: 'var(--border)' }}>
            <p className="text-[9px] opacity-70" style={{ color: 'var(--primary-foreground)' }}>
              © {new Date().getFullYear()} {c.footer.companyName || 'Flora Group'}. {c.footer.rightsText || 'All rights reserved.'}
            </p>
          </div>
        </>
      )}

      {activePage === 'Contact page' && (
        <>
          <div className="px-4 py-5" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              {c.contact.eyebrow || 'Contact'}
            </p>
            <p className="mt-1.5 font-semibold">{c.contact.title || 'Get In Touch'}</p>
            <p className="mt-1 text-[10px] opacity-75 line-clamp-2">{c.contact.subtitle || 'Subtitle...'}</p>
          </div>
          <div className="border-t px-4 py-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[var(--radius)] border p-2" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--card-foreground)' }}>
                  {c.contact.headOfficeName || 'Head Office'}
                </p>
                <p className="mt-0.5 text-[9px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                  {c.contact.headOfficeAddress || 'Address'}
                </p>
                <p className="mt-0.5 text-[9px]" style={{ color: 'var(--muted-foreground)' }}>
                  {c.contact.headOfficePhone || c.contact.headOfficeEmail || `${c.contact.hoursDays} · ${c.contact.hoursTime}`}
                </p>
              </div>
              <div className="rounded-[var(--radius)] border p-2" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
                <p className="text-[10px] font-medium" style={{ color: 'var(--card-foreground)' }}>
                  {c.contact.flowersOfficeName || 'Flowers Office'}
                </p>
                <p className="mt-0.5 text-[9px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                  {c.contact.flowersOfficeAddress || 'Address'}
                </p>
                <p className="mt-0.5 text-[9px]" style={{ color: 'var(--muted-foreground)' }}>
                  {c.contact.flowersOfficePhone || c.contact.flowersOfficeEmail || `${c.contact.hoursDays} · ${c.contact.hoursTime}`}
                </p>
              </div>
            </div>
            <div
              className="mt-2 rounded-[var(--radius)] border p-2.5"
              style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
            >
              <p className="text-[10px] font-medium" style={{ color: 'var(--card-foreground)' }}>
                {c.contact.sendTitle || 'Send a Message'}
              </p>
              <p className="mt-0.5 text-[9px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
                {c.contact.sendHelp || 'Helper text...'}
              </p>
            </div>
          </div>
        </>
      )}

      {activePage === 'Careers page' && (
        <>
          <div className="px-4 py-5" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
            <p className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
              {c.careersHero.eyebrow || 'Careers'}
            </p>
            <p className="mt-1.5 font-semibold">{c.careersHero.title || 'Join Our Team'}</p>
            <p className="mt-1 text-[10px] opacity-75 line-clamp-2">{c.careersHero.subtitle || 'Subtitle...'}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span
                className="rounded-[var(--radius)] px-2.5 py-1 text-[10px] font-medium"
                style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
              >
                {c.careersHero.viewRoles || 'View Roles'}
              </span>
              <span
                className="rounded-[var(--radius)] border px-2.5 py-1 text-[10px] opacity-80"
                style={{ borderColor: 'var(--primary-foreground)' }}
              >
                {c.careersHero.generalApply || 'General Apply'}
              </span>
            </div>
          </div>
          <div className="border-t px-4 py-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
            <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: 'var(--gold)' }}>
              {c.careersCulture.eyebrow || 'Culture'}
            </p>
            <p className="mt-0.5 font-semibold" style={{ color: 'var(--foreground)' }}>
              {c.careersCulture.title || 'Our Culture'}
            </p>
            <p className="mt-0.5 text-[10px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
              {c.careersCulture.description || 'Description...'}
            </p>
          </div>
          <div className="border-t px-4 py-3" style={{ background: 'var(--maroon)', borderColor: 'var(--border)' }}>
            <p className="font-semibold" style={{ color: 'var(--primary-foreground)' }}>
              {c.careersCta.title || 'Ready to join?'}
            </p>
            <p className="mt-0.5 text-[9px] opacity-75 line-clamp-1" style={{ color: 'var(--primary-foreground)' }}>
              {c.careersCta.body || 'CTA body...'}
            </p>
            <span
              className="mt-2 inline-block rounded-[var(--radius)] px-2.5 py-1 text-[10px] font-medium"
              style={{ background: 'var(--gold)', color: 'var(--gold-foreground, #2a0d12)' }}
            >
              {c.careersCta.button || 'Apply Now'}
            </span>
          </div>
        </>
      )}

    </div>
  )
}

// ─── Media ───────────────────────────────────────────────────────────────────

function MediaPreview({ payload }: { payload: UiConfigPayload }) {
  const vars = themeVars(payload.theme)
  const subsidiaries = payload.subsidiaries?.items ?? []

  return (
    <div className="space-y-3">
      <div style={vars} className="overflow-hidden rounded-[var(--radius)] border">
        {/* Nav bar */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: 'var(--maroon-deep)' }}>
          <Img
            src={payload.images.logo}
            alt="logo"
            className="h-7 max-w-[80px] object-contain"
            dark
          />
          <div className="ml-auto flex gap-3">
            {['Home', 'About', 'Careers'].map((label) => (
              <span key={label} className="text-[9px] font-medium opacity-60" style={{ color: 'var(--primary-foreground)' }}>
                {label}
              </span>
            ))}
          </div>
        </div>
        {/* Hero image with overlay */}
        <div className="relative h-36 overflow-hidden" style={{ background: 'var(--muted)' }}>
          <Img
            src={payload.images.heroImage}
            alt="hero"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, var(--maroon-deep) 0%, transparent 60%)' }}
          />
          <div className="absolute inset-0 flex items-center px-4">
            <div className="space-y-1.5">
              <div className="h-2 w-16 rounded-full opacity-60" style={{ background: 'var(--gold)' }} />
              <div className="h-3 w-28 rounded opacity-90" style={{ background: 'var(--primary-foreground)' }} />
              <div className="h-2 w-20 rounded opacity-50" style={{ background: 'var(--primary-foreground)' }} />
            </div>
          </div>
        </div>
      </div>

      {subsidiaries.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {subsidiaries.slice(0, 3).map((sub) => (
            <div key={sub.slug} className="overflow-hidden rounded-lg border border-neutral-200">
              <Img
                src={sub.image ?? ''}
                alt={sub.name.en || sub.slug}
                className="h-14 w-full object-cover"
              />
              <p className="truncate px-2 py-1 text-[9px] font-medium text-neutral-600">
                {sub.name.en || sub.slug}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Email ───────────────────────────────────────────────────────────────────

function EmailPreview({ payload, locale }: { payload: UiConfigPayload; locale: Locale }) {
  const contact = payload.content[locale].contact
  const footer = payload.content[locale].footer

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border text-[11px]">
      <div className="px-4 py-4" style={{ background: 'var(--maroon)', color: 'var(--primary-foreground)' }}>
        <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">Contact delivery</p>
        <p className="mt-2 font-mono text-sm">
          {contact.formRecipientEmail || '— not set —'}
        </p>
        <p className="mt-1 text-[9px] opacity-65">Form submissions → this inbox (server-side)</p>
      </div>
      <div className="border-t px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--background)' }}>
        <p className="text-[10px] font-medium" style={{ color: 'var(--foreground)' }}>Footer display</p>
        <p className="mt-1 font-mono text-[10px]" style={{ color: 'var(--muted-foreground)' }}>
          {footer.email || '—'}
        </p>
      </div>
    </div>
  )
}

// ─── Social ──────────────────────────────────────────────────────────────────

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  facebook: 'Facebook',
  x: 'X',
  youtube: 'YouTube',
}

function SocialPreview({ payload }: { payload: UiConfigPayload }) {
  const social = payload.social
  const vars = themeVars(payload.theme)

  if (!social?.enabled) {
    return (
      <div className="rounded-lg border border-border bg-surface-sunken p-4 text-sm text-muted">
        Social links disabled — footer icons hidden on the public site.
      </div>
    )
  }

  const links = (social.links ?? []).filter((l) => l.url?.trim())

  return (
    <div style={vars} className="overflow-hidden rounded-[var(--radius)] border">
      <div className="px-4 py-4" style={{ background: 'var(--maroon)', color: 'var(--primary-foreground)' }}>
        <p className="text-[10px] font-medium uppercase tracking-wider opacity-70">Footer social</p>
        {links.length === 0 ? (
          <p className="mt-2 text-[11px] opacity-75">Enabled but no links yet.</p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link, i) => (
              <span
                key={`${link.platform}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px]"
                style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }}
              >
                <span className="size-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
                {SOCIAL_LABELS[link.platform] ?? link.platform}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Branding ────────────────────────────────────────────────────────────────

function BrandingPreview({ payload }: { payload: UiConfigPayload }) {
  const { siteTitle, metaDescription, themeColor } = payload.branding
  const displayColor = /^#/.test(themeColor) ? themeColor : '#4a0e17'

  return (
    <div className="space-y-3">
      {/* Browser tab mockup */}
      <div className="overflow-hidden rounded-lg border border-neutral-200">
        <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-200 px-3 py-2">
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-red-400" />
            <div className="size-2 rounded-full bg-yellow-400" />
            <div className="size-2 rounded-full bg-green-400" />
          </div>
          <div className="flex flex-1 items-center rounded bg-white px-2 py-1 text-[9px] text-neutral-400">
            floragroup.qa
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 px-3 py-2">
          <div className="size-3 shrink-0 rounded-sm border border-white/20" style={{ background: displayColor }} />
          <span className="truncate text-[10px] font-medium text-neutral-700">{siteTitle || 'Flora Group'}</span>
        </div>
      </div>

      {/* OG / social share card */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="h-12" style={{ background: displayColor }} />
        <div className="px-3 py-2.5">
          <p className="text-[9px] uppercase tracking-wide text-neutral-400">floragroup.qa</p>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-neutral-900">
            {siteTitle || 'Flora Group'}
          </p>
          <p className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">
            {metaDescription || 'Meta description will appear here when this page is shared on social media.'}
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Layout ──────────────────────────────────────────────────────────────────

const LAYOUT_BLOCKS: {
  label: string
  always?: true
  sectionKey?: 'showStats' | 'showSubsidiaries' | 'showSpotlight'
  bgVar: string
  fgVar: string
  tall?: true
}[] = [
  { label: 'Navigation', always: true, bgVar: 'var(--maroon-deep)', fgVar: 'var(--primary-foreground)' },
  { label: 'Hero', always: true, tall: true, bgVar: 'var(--maroon)', fgVar: 'var(--primary-foreground)' },
  { label: 'Stats', sectionKey: 'showStats', bgVar: 'var(--background)', fgVar: 'var(--foreground)' },
  { label: 'Subsidiaries', sectionKey: 'showSubsidiaries', bgVar: 'var(--card)', fgVar: 'var(--card-foreground)' },
  { label: 'Spotlight', sectionKey: 'showSpotlight', bgVar: 'var(--secondary)', fgVar: 'var(--secondary-foreground)' },
  { label: 'Footer', always: true, bgVar: 'var(--maroon-deep)', fgVar: 'var(--primary-foreground)' },
]

function LayoutPreview({ payload }: { payload: UiConfigPayload }) {
  const vars = themeVars(payload.theme)

  return (
    <div style={vars} className="overflow-hidden rounded-[var(--radius)] border border-neutral-200 divide-y divide-neutral-200/30">
      {LAYOUT_BLOCKS.map((block) => {
        const visible = block.always || (block.sectionKey ? payload.sections[block.sectionKey] : true)
        return (
          <div
            key={block.label}
            className={cn(
              'flex items-center justify-between px-4 transition-all duration-300',
              block.tall ? 'py-5' : 'py-2.5',
              !visible && 'opacity-25 grayscale',
            )}
            style={{ background: block.bgVar }}
          >
            <span className="text-[11px] font-medium" style={{ color: block.fgVar }}>
              {block.label}
            </span>
            {!block.always && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[9px] font-medium',
                  visible ? 'bg-white/20' : 'bg-black/20',
                )}
                style={{ color: block.fgVar }}
              >
                {visible ? 'Visible' : 'Hidden'}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Subsidiaries ────────────────────────────────────────────────────────────

function SubsidiariesPreview({ payload }: { payload: UiConfigPayload }) {
  const vars = themeVars(payload.theme)
  const count = payload.subsidiaries?.items?.length ?? 0

  return (
    <div style={vars} className="overflow-hidden rounded-[var(--radius)] border">
      <div className="px-4 py-5" style={{ background: 'var(--maroon-deep)', color: 'var(--primary-foreground)' }}>
        <p className="text-[9px] uppercase tracking-widest font-medium" style={{ color: 'var(--gold)' }}>
          Subsidiaries
        </p>
        <p className="mt-2 font-semibold">Company Profiles</p>
        <p className="mt-1 text-[10px] opacity-75">
          {payload.subsidiaries?.enabled ? `Showing ${count} companies` : 'Subsidiaries section disabled'}
        </p>
      </div>
      {payload.subsidiaries?.items && payload.subsidiaries.items.length > 0 && (
        <div className="border-t px-4 py-3" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
          <div className="grid grid-cols-3 gap-2">
            {payload.subsidiaries.items.slice(0, 3).map((sub) => (
              <div key={sub.slug} className="overflow-hidden rounded-md border border-neutral-200/60">
                <Img
                  src={sub.image ?? ''}
                  alt={sub.name.en || sub.slug}
                  className="h-12 w-full object-cover"
                />
                <p className="truncate px-1.5 py-1 text-[9px] font-medium" style={{ color: 'var(--foreground)' }}>
                  {sub.name.en || sub.slug}
                </p>
              </div>
            ))}
          </div>
          {count > 3 && (
            <p className="mt-2 text-[9px]" style={{ color: 'var(--muted-foreground)' }}>
              +{count - 3} more companies
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Preview hint copy ────────────────────────────────────────────────────────

const HINTS: Record<SectionId, string> = {
  appearance: 'Uses the same CSS-variable mapping as the public site.',
  content: 'Reflects the active page tab and locale.',
  media: 'Site logo, hero, favicon, and subsidiary cover photos.',
  branding: 'Browser tab and social share card preview.',
  email: 'Contact form recipient and public display addresses.',
  social: 'Footer social icons when enabled.',
  subsidiaries: 'Manage company profiles with bilingual content and images.',
  layout: 'Dimmed sections are hidden on the public site.',
}

// ─── Router ──────────────────────────────────────────────────────────────────

export function SectionPreview({
  active,
  payload,
  contentPage,
  contentLocale,
  emailLocale,
}: {
  active: SectionId
  payload: UiConfigPayload
  contentPage: string
  contentLocale: Locale
  emailLocale?: Locale
}) {
  return (
    <aside>
      {active === 'appearance' && <AppearancePreview payload={payload} />}
      {active === 'content' && <ContentPreview payload={payload} activePage={contentPage} locale={contentLocale} />}
      {active === 'media' && <MediaPreview payload={payload} />}
      {active === 'branding' && <BrandingPreview payload={payload} />}
      {active === 'email' && <EmailPreview payload={payload} locale={emailLocale ?? contentLocale} />}
      {active === 'social' && <SocialPreview payload={payload} />}
      {active === 'subsidiaries' && <SubsidiariesPreview payload={payload} />}
      {active === 'layout' && <LayoutPreview payload={payload} />}
      <p className="mt-3 text-xs text-neutral-400">{HINTS[active]}</p>
    </aside>
  )
}
