import type { UiConfigPayload } from './types'

/**
 * Returns human-readable problems that must be fixed before the UI config can be
 * saved. An empty array means the payload is valid. Today this guards subsidiary
 * slugs (they become public URLs and the row identity); add further checks here as
 * the editor grows.
 */
export function validateUiConfig(payload: UiConfigPayload): string[] {
  const errors: string[] = []
  const items = payload.subsidiaries?.items ?? []

  // Lowercase letters/numbers in dash-separated segments — e.g. "flora-trading".
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  const slugCounts = new Map<string, number>()

  items.forEach((sub, index) => {
    const label = sub.name?.en?.trim() || `Subsidiary #${index + 1}`
    const slug = sub.slug?.trim() ?? ''

    if (!slug) {
      errors.push(`${label}: URL slug is required.`)
    } else if (!slugPattern.test(slug)) {
      errors.push(`${label}: slug "${slug}" must be lowercase letters, numbers and single dashes.`)
    }

    if (slug) slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1)
  })

  for (const [slug, count] of slugCounts) {
    if (count > 1) errors.push(`Duplicate slug "${slug}" is used by ${count} subsidiaries.`)
  }

  return errors
}
