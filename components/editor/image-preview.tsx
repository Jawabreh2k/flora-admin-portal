'use client'

import { useEffect, useState } from 'react'
import { ImageOff } from 'lucide-react'
import { resolveMediaSrc } from '@/lib/media'
import { cn } from '@/lib/utils'

export function ImagePreview({
  src,
  dark,
  className,
  objectFit = 'contain',
}: {
  src: string
  dark?: boolean
  className?: string
  objectFit?: 'contain' | 'cover'
}) {
  const [error, setError] = useState(false)
  const resolved = resolveMediaSrc(src)

  useEffect(() => {
    setError(false)
  }, [src])

  return (
    <div
      className={cn(
        'grid h-28 w-full place-items-center overflow-hidden rounded-lg border border-border',
        dark ? 'bg-neutral-800' : 'bg-neutral-50',
        className,
      )}
    >
      {resolved && !error ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt="preview"
          className={cn(
            'max-h-full max-w-full',
            objectFit === 'cover' ? 'h-full w-full object-cover' : 'object-contain',
          )}
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
