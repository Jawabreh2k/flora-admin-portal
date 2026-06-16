'use client'

import type { Branding, UiConfigPayload } from '@/lib/types'
import { Card, Field, TextArea, TextInput } from '../editor/inputs'

export function BrandingSection({
  payload,
  setBranding,
}: {
  payload: UiConfigPayload
  setBranding: (key: keyof Branding, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <Card title="Site metadata" description="Used for the browser tab, search results, and social sharing.">
        <div className="space-y-3">
          <Field label="Site title">
            <TextInput value={payload.branding.siteTitle} onChange={(v) => setBranding('siteTitle', v)} />
          </Field>
          <Field label="Meta description">
            <TextArea value={payload.branding.metaDescription} onChange={(v) => setBranding('metaDescription', v)} rows={2} />
          </Field>
          <p className="text-xs text-muted">
            Favicon and site images are managed in the <span className="font-medium text-foreground">Media</span> tab.
          </p>
        </div>
      </Card>

      <Card title="Browser theme colour" description="Tints the mobile browser UI around the page.">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={/^#/.test(payload.branding.themeColor) ? payload.branding.themeColor : '#000000'}
            onChange={(e) => setBranding('themeColor', e.target.value)}
            className="size-8 cursor-pointer rounded border border-neutral-300 p-0.5"
          />
          <input
            type="text"
            value={payload.branding.themeColor}
            onChange={(e) => setBranding('themeColor', e.target.value)}
            className="w-32 rounded-md border border-neutral-300 px-2 py-1.5 font-mono text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </Card>
    </div>
  )
}
