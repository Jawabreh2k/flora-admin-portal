'use client'

import { useRef, useState } from 'react'
import { Loader2, Upload } from 'lucide-react'
import { Field, TextInput } from './inputs'
import { ImagePreview } from './image-preview'
import { Button } from '@/components/ui/button'

export function MediaAssetField({
  label,
  hint,
  value,
  onChange,
  onUpload,
  previewDark,
  previewCover,
}: {
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  onUpload?: (file: File) => Promise<void>
  previewDark?: boolean
  previewCover?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    if (!onUpload) return
    setUploading(true)
    setError(null)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        <ImagePreview
          src={value}
          dark={previewDark}
          objectFit={previewCover ? 'cover' : 'contain'}
        />
        <TextInput
          mono
          value={value}
          onChange={onChange}
          placeholder="/images/example.jpg or https://..."
        />
        {onUpload && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void handleFile(file)
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="size-3.5" />
                  Upload image
                </>
              )}
            </Button>
          </div>
        )}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    </Field>
  )
}
