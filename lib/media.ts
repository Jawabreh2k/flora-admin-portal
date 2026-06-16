const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

/** Resolves a possibly-relative image path against the public site origin for preview. */
export function resolveMediaSrc(src: string): string {
  if (!src) return ''
  if (/^https?:\/\//.test(src) || src.startsWith('data:')) return src
  return `${PUBLIC_SITE_URL}${src.startsWith('/') ? '' : '/'}${src}`
}

export async function uploadSubsidiaryAsset(
  slug: string,
  field: 'image' | 'logo',
  file: File,
): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('subsidiary', slug)
  formData.append('field', field)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed.')
  }
  if (!data.url || typeof data.url !== 'string') {
    throw new Error('Upload succeeded but no URL was returned.')
  }

  return data.url
}
