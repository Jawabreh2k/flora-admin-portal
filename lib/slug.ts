/** URL-safe slug from arbitrary text (lowercase, dashes, no leading/trailing dashes). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Returns a slug guaranteed not to collide with any already in use. */
export function uniqueSlug(base: string, existing: string[]): string {
  const root = slugify(base) || 'subsidiary'
  if (!existing.includes(root)) return root
  let i = 2
  while (existing.includes(`${root}-${i}`)) i++
  return `${root}-${i}`
}
