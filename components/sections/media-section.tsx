'use client'

import type { Branding, Images, ManagedSubsidiary, UiConfigPayload } from '@/lib/types'
import { uploadSubsidiaryAsset } from '@/lib/media'
import { Card } from '../editor/inputs'
import { MediaAssetField } from '../editor/media-asset-field'

export function MediaSection({
  payload,
  setImage,
  setBranding,
  setSubsidiaries,
}: {
  payload: UiConfigPayload
  setImage: (key: keyof Images, value: string) => void
  setBranding: (key: keyof Branding, value: string) => void
  setSubsidiaries: (subsidiaries: UiConfigPayload['subsidiaries']) => void
}) {
  const subsidiaries = payload.subsidiaries?.items ?? []

  const updateSubsidiaryAsset = (slug: string, field: 'image' | 'logo', value: string) => {
    setSubsidiaries({
      enabled: payload.subsidiaries?.enabled ?? true,
      items: subsidiaries.map((item) => (item.slug === slug ? { ...item, [field]: value } : item)),
    })
  }

  const uploadForSubsidiary = (slug: string, field: 'image' | 'logo') => async (file: File) => {
    const url = await uploadSubsidiaryAsset(slug, field, file)
    updateSubsidiaryAsset(slug, field, url)
  }

  return (
    <div className="space-y-6">
      <Card
        title="Site-wide images"
        description="Logo, hero, and favicon used across the public website."
      >
        <div className="space-y-6">
          <MediaAssetField
            label="Header & footer logo"
            hint="Shown in navigation, footer, and hero watermark."
            value={payload.images.logo}
            onChange={(v) => setImage('logo', v)}
            previewDark
          />
          <MediaAssetField
            label="Homepage hero photo"
            hint="The large background image on the homepage hero."
            value={payload.images.heroImage}
            onChange={(v) => setImage('heroImage', v)}
            previewCover
          />
          <MediaAssetField
            label="Contact page hero"
            hint="Background image on the contact page."
            value={payload.images.contactHero}
            onChange={(v) => setImage('contactHero', v)}
            previewCover
          />
          <MediaAssetField
            label="Careers page hero"
            hint="Background image on the careers page."
            value={payload.images.careersHero}
            onChange={(v) => setImage('careersHero', v)}
            previewCover
          />
          <MediaAssetField
            label="Favicon / browser icon"
            hint="Shown in the browser tab and when bookmarking the site."
            value={payload.branding.logoUrl}
            onChange={(v) => setBranding('logoUrl', v)}
            previewDark
          />
        </div>
      </Card>

      <Card
        title="Subsidiary images"
        description="Cover photos and logos for each company. Text and contact details stay in the Subsidiaries tab."
      >
        <div className="space-y-8">
          {subsidiaries.length === 0 ? (
            <p className="text-sm text-muted">No subsidiaries configured yet.</p>
          ) : (
            subsidiaries.map((subsidiary) => (
              <SubsidiaryMediaGroup
                key={subsidiary.slug}
                subsidiary={subsidiary}
                onChange={updateSubsidiaryAsset}
                onUpload={uploadForSubsidiary}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

function SubsidiaryMediaGroup({
  subsidiary,
  onChange,
  onUpload,
}: {
  subsidiary: ManagedSubsidiary
  onChange: (slug: string, field: 'image' | 'logo', value: string) => void
  onUpload: (slug: string, field: 'image' | 'logo') => (file: File) => Promise<void>
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-sunken/40 p-4">
      <div className="mb-4 border-b border-border pb-3">
        <p className="text-sm font-semibold text-foreground">{subsidiary.name.en || subsidiary.slug}</p>
        <p className="text-xs text-muted">{subsidiary.slug}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <MediaAssetField
          label="Cover image"
          hint="Card background on the homepage and hero on profile pages."
          value={subsidiary.image ?? ''}
          onChange={(v) => onChange(subsidiary.slug, 'image', v)}
          onUpload={onUpload(subsidiary.slug, 'image')}
          previewCover
        />
        <MediaAssetField
          label="Company logo"
          hint="Official logo shown on cards and profile headers."
          value={subsidiary.logo ?? ''}
          onChange={(v) => onChange(subsidiary.slug, 'logo', v)}
          onUpload={onUpload(subsidiary.slug, 'logo')}
          previewDark
        />
      </div>
    </div>
  )
}
