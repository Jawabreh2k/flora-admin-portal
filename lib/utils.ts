import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Human label for a camelCase theme token, e.g. "primaryForeground" → "Primary foreground". */
export function humanizeKey(key: string): string {
  const spaced = key.replace(/([A-Z])/g, ' $1').toLowerCase().trim()
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}
