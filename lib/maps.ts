/**
 * Turns an admin-supplied "map location" into an embeddable Google Maps iframe `src`,
 * used for the live preview in the content editor. Accepts a Maps link, a plain
 * address, or bare coordinates "lat, lng".
 *
 * NOTE: kept in sync with flora-group-website/lib/maps.ts (the public site renders
 * the same result). If you change the logic here, change it there too.
 */
export function buildMapEmbedSrc(raw?: string | null): string | null {
  const value = raw?.trim()
  if (!value) return null

  // 1. Already an embeddable URL.
  if (/\/maps\/embed/i.test(value) || /[?&]output=embed/i.test(value)) return value

  const embedForQuery = (q: string) =>
    `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
  const embedForCoords = (lat: string, lng: string) =>
    `https://www.google.com/maps?q=${lat},${lng}&output=embed`

  // 2. Bare coordinates "lat, lng".
  const coords = value.match(/^(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/)
  if (coords) return embedForCoords(coords[1], coords[2])

  // 3. A Maps URL — pull coordinates or a query out of it.
  if (/^https?:\/\//i.test(value)) {
    const at = value.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (at) return embedForCoords(at[1], at[2])
    try {
      const url = new URL(value)
      const q = url.searchParams.get('q') ?? url.searchParams.get('query')
      if (q) return embedForQuery(q)
    } catch {
      /* fall through to best-effort */
    }
    return embedForQuery(value)
  }

  // 4. Plain address / place name.
  return embedForQuery(value)
}
