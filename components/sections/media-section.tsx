'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import type { Images, UiConfigPayload } from '@/lib/types'
import { Card, Field, TextInput } from '../editor/inputs'

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/** Resolves a possibly-relative image path against the public site origin for preview. */
function resolveSrc(src: string): string {
  if (!src) return ''
  if (/^https?:\/\//.test(src) || src.startsWith('data:')) return src
  return `${PUBLIC_SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

function ImagePreview({ src, dark }: { src: string; dark?: boolean }) {
  const [error, setError] = useState(false)
  const resolved = resolveSrc(src)
  return (
    <div
      className={`grid h-28 w-full place-items-center overflow-hidden rounded-lg border border-neutral-200 ${
        dark ? 'bg-neutral-800' : 'bg-neutral-50'
      }`}
    >
      {resolved && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt="preview"
          className="max-h-full max-w-full object-contain"
          onError={() => setError(true)}
          onLoad={() => setError(false)}
        />
      ) : (
        <span className="flex flex-col items-center gap-1 text-xs text-neutral-400">
          <ImageOff className="size-5" />
          {error ? 'Could not load image' : 'No image'}
        </span>
      )}
    </div>
  )
}

export function MediaSection({
  payload,
  setImage,
}: {
  payload: UiConfigPayload
  setImage: (key: keyof Images, value: string) => void
}) {
  return (
    <div className="space-y-6">
      <Card
        title="Header & footer logo"
        description="Shown in the navigation bar, footer, and hero watermark. Use a relative path (e.g. /images/logo.png) or a full URL."
      >
        <div className="space-y-3">
          <ImagePreview src={payload.images.logo} dark />
          <Field label="Logo URL">
            <TextInput mono value={payload.images.logo} onChange={(v) => setImage('logo', v)} />
          </Field>
        </div>
      </Card>

      <Card title="Hero image" description="The large photo in the homepage hero (Doha skyline by default).">
        <div className="space-y-3">
          <ImagePreview src={payload.images.heroImage} />
          <Field label="Hero image URL">
            <TextInput mono value={payload.images.heroImage} onChange={(v) => setImage('heroImage', v)} />
          </Field>
        </div>
      </Card>
    </div>
  )
}
