/**
 * Presentation metadata for the Appearance editor.
 *
 * This is admin-only UI sugar — it explains, in plain language, what each theme
 * colour actually controls on the public site, which other token it sits on top
 * of (for contrast checks), and how the colours are grouped in the editor. The
 * canonical Theme contract lives in `lib/types.ts`; this file never changes the
 * data shape, only how we describe it to an editor.
 */

import type { Theme } from './types'

export type ColorTokenKey =
  | 'background'
  | 'foreground'
  | 'card'
  | 'cardForeground'
  | 'primary'
  | 'primaryForeground'
  | 'secondary'
  | 'secondaryForeground'
  | 'muted'
  | 'mutedForeground'
  | 'accent'
  | 'accentForeground'
  | 'border'
  | 'input'
  | 'ring'
  | 'destructive'
  | 'gold'
  | 'goldSoft'
  | 'goldForeground'
  | 'maroon'
  | 'maroonDeep'

export type TokenMeta = {
  /** Friendly display name. */
  label: string
  /** One line on what this colour actually controls on the site. */
  description: string
  /** Short chip, e.g. "Buttons · Links". */
  usedIn: string
  /**
   * For text tokens: the surface token it normally sits on. Drives the inline
   * WCAG contrast badge so editors can't accidentally pick unreadable pairs.
   */
  pairWith?: ColorTokenKey
}

export const TOKEN_META: Record<ColorTokenKey, TokenMeta> = {
  // ── Brand ──────────────────────────────────────────────────────────────
  primary: {
    label: 'Primary',
    description: 'Main brand colour for solid buttons, links and key figures.',
    usedIn: 'Buttons · Links',
  },
  primaryForeground: {
    label: 'Primary text',
    description: 'Text that sits on primary buttons and dark brand areas.',
    usedIn: 'Text on dark',
    pairWith: 'primary',
  },
  maroon: {
    label: 'Maroon',
    description: 'Royal maroon used for the hero and footer surfaces.',
    usedIn: 'Hero · Footer',
  },
  maroonDeep: {
    label: 'Maroon (deep)',
    description: 'Darkest maroon — the top navigation and hero/footer base.',
    usedIn: 'Nav base',
  },
  gold: {
    label: 'Gold',
    description: 'Champagne gold for eyebrows, badges, CTAs and highlight words.',
    usedIn: 'Accents · CTAs',
  },
  goldSoft: {
    label: 'Gold (soft)',
    description: 'Lighter gold for soft fills, hairline borders and gradients.',
    usedIn: 'Soft fills',
  },
  goldForeground: {
    label: 'Gold text',
    description: 'Text that sits on gold buttons and badges.',
    usedIn: 'Text on gold',
    pairWith: 'gold',
  },

  // ── Surfaces ───────────────────────────────────────────────────────────
  background: {
    label: 'Background',
    description: 'The page background behind every section.',
    usedIn: 'Page',
  },
  foreground: {
    label: 'Body text',
    description: 'Default text colour on the page background.',
    usedIn: 'Body text',
    pairWith: 'background',
  },
  card: {
    label: 'Card',
    description: 'Surface of cards — subsidiary tiles, stat cards and panels.',
    usedIn: 'Cards',
  },
  cardForeground: {
    label: 'Card text',
    description: 'Headings and text inside cards.',
    usedIn: 'Card text',
    pairWith: 'card',
  },
  muted: {
    label: 'Muted',
    description: 'Subtle background for quiet panels and disabled states.',
    usedIn: 'Quiet panels',
  },
  mutedForeground: {
    label: 'Muted text',
    description: 'Secondary, lower-emphasis text — captions and labels.',
    usedIn: 'Captions',
    pairWith: 'muted',
  },

  // ── Accents & UI ─────────────────────────────────────────────────────────
  secondary: {
    label: 'Secondary',
    description: 'Soft neutral fill for secondary buttons and chips.',
    usedIn: 'Secondary fills',
  },
  secondaryForeground: {
    label: 'Secondary text',
    description: 'Text that sits on secondary fills.',
    usedIn: 'On secondary',
    pairWith: 'secondary',
  },
  accent: {
    label: 'Accent',
    description: 'Accent fill for highlights and hover states.',
    usedIn: 'Highlights',
  },
  accentForeground: {
    label: 'Accent text',
    description: 'Text that sits on accent fills.',
    usedIn: 'On accent',
    pairWith: 'accent',
  },
  border: {
    label: 'Border',
    description: 'Borders and dividers between cards and sections.',
    usedIn: 'Borders',
  },
  input: {
    label: 'Input border',
    description: 'Border around form inputs and selects.',
    usedIn: 'Form fields',
  },
  ring: {
    label: 'Focus ring',
    description: 'The glow shown when a field or button is focused.',
    usedIn: 'Focus state',
  },
  destructive: {
    label: 'Destructive',
    description: 'Errors, required markers and destructive actions.',
    usedIn: 'Errors',
  },
}

export type ColorGroup = {
  label: string
  hint: string
  keys: ColorTokenKey[]
}

/** Colour tokens grouped for a friendlier, explained editor layout. */
export const COLOR_GROUPS: ColorGroup[] = [
  {
    label: 'Brand',
    hint: 'Your signature maroon and gold — the colours visitors notice first.',
    keys: ['primary', 'primaryForeground', 'maroon', 'maroonDeep', 'gold', 'goldSoft', 'goldForeground'],
  },
  {
    label: 'Surfaces & text',
    hint: 'Page, cards and the text that sits on them.',
    keys: ['background', 'foreground', 'card', 'cardForeground', 'muted', 'mutedForeground'],
  },
  {
    label: 'Accents & UI',
    hint: 'Buttons, borders, focus states and system colours.',
    keys: ['secondary', 'secondaryForeground', 'accent', 'accentForeground', 'border', 'input', 'ring', 'destructive'],
  },
]

// ─── WCAG contrast helpers ─────────────────────────────────────────────────
// Theme values are authored as hex (see lib/ui-config/defaults). For any value
// we can't parse (e.g. an oklch() literal) we return null and skip the badge
// rather than guessing.

function hexToRgb(value: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
  if (!m) return null
  let hex = m[1]
  if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('')
  const n = parseInt(hex, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const lin = [r, g, b].map((channel) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

/** WCAG contrast ratio (1–21) between two colours, or null if unparseable. */
export function contrastRatio(fg: string, bg: string): number | null {
  const a = hexToRgb(fg)
  const b = hexToRgb(bg)
  if (!a || !b) return null
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastGrade = { ratio: number; label: 'AAA' | 'AA' | 'AA Large' | 'Low'; pass: boolean }

/** Grades a contrast ratio against WCAG thresholds for normal text. */
export function gradeContrast(ratio: number): ContrastGrade {
  if (ratio >= 7) return { ratio, label: 'AAA', pass: true }
  if (ratio >= 4.5) return { ratio, label: 'AA', pass: true }
  if (ratio >= 3) return { ratio, label: 'AA Large', pass: false }
  return { ratio, label: 'Low', pass: false }
}

/** True when a string looks like an editable hex colour. */
export function isHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)
}

export const SHARED_HIGHLIGHT = '#06b6d4' // cyan-500, used to link fields ↔ preview

/** Keys we treat as colours (everything in Theme except shape/typography). */
export const COLOR_TOKEN_KEYS: ColorTokenKey[] = COLOR_GROUPS.flatMap((g) => g.keys)

// ─── Factory defaults & presets ────────────────────────────────────────────
// DEFAULT_THEME mirrors the backend seed (Flora.Cms.Application → UiConfigPayload
// ThemeDto). Keep the two in sync — "Reset to default" restores exactly this.

export const DEFAULT_THEME: Theme = {
  background: '#fcfbf9',
  foreground: '#3a2329',
  card: '#ffffff',
  cardForeground: '#3a2329',
  primary: '#4a0e17',
  primaryForeground: '#fbf6ef',
  secondary: '#f5f2ee',
  secondaryForeground: '#4a0e17',
  muted: '#f5f2ee',
  mutedForeground: '#6f6760',
  accent: '#c5a880',
  accentForeground: '#42121b',
  border: '#e8e3dc',
  input: '#e8e3dc',
  ring: '#c5a880',
  destructive: '#c0392b',
  gold: '#c5a880',
  goldSoft: '#ddc9a8',
  goldForeground: '#42121b',
  maroon: '#4a0e17',
  maroonDeep: '#350a11',
  radius: '0.625rem',
  fontHeading: 'Playfair Display',
  fontSans: 'Inter',
}

// DEFAULT_DARK_THEME mirrors the backend seed (ThemeDto.CreateDefaultDark).
// Reweights the brand's two colours rather than inverting to grey: maroon
// becomes the deep surface colour, gold becomes the primary interactive
// accent. Shape/typography mirror the light defaults — the public site only
// ever applies the colour tokens from this variant.
export const DEFAULT_DARK_THEME: Theme = {
  background: '#16090a',
  foreground: '#f2eae1',
  card: '#231212',
  cardForeground: '#f2eae1',
  primary: '#e2b577',
  primaryForeground: '#22080a',
  secondary: '#2e1a1b',
  secondaryForeground: '#ede3d6',
  muted: '#281616',
  mutedForeground: '#a28d82',
  accent: '#e2b577',
  accentForeground: '#22080a',
  border: '#3a2525',
  input: '#3a2525',
  ring: '#e2b577',
  destructive: '#f14442',
  gold: '#e2b577',
  goldSoft: '#4b3216',
  goldForeground: '#22080a',
  maroon: '#500516',
  maroonDeep: '#190002',
  radius: '0.625rem',
  fontHeading: 'Playfair Display',
  fontSans: 'Inter',
}

export type PresetColors = Record<ColorTokenKey, string>

export type ThemePreset = {
  id: string
  label: string
  note?: string
  colors: PresetColors
}

function pickColors(theme: Theme): PresetColors {
  const out = {} as PresetColors
  for (const key of COLOR_TOKEN_KEYS) out[key] = theme[key]
  return out
}

/** Swatches shown on a preset card (brand → accent → surface). */
export const PRESET_SWATCH_KEYS: ColorTokenKey[] = ['maroonDeep', 'primary', 'gold', 'accent', 'background']

/** Curated, contrast-checked palettes. Clicking one recolours the whole site. */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'flora',
    label: 'Flora Maroon',
    note: 'Default',
    colors: pickColors(DEFAULT_THEME),
  },
  {
    id: 'emerald',
    label: 'Emerald & Gold',
    colors: {
      background: '#f9fbf9',
      foreground: '#1d2a22',
      card: '#ffffff',
      cardForeground: '#1d2a22',
      primary: '#0f5132',
      primaryForeground: '#f3f8f4',
      secondary: '#eef4f0',
      secondaryForeground: '#0f5132',
      muted: '#eef4f0',
      mutedForeground: '#5e6b63',
      accent: '#c8a86a',
      accentForeground: '#2a2410',
      border: '#dde8e1',
      input: '#dde8e1',
      ring: '#c8a86a',
      destructive: '#c0392b',
      gold: '#c8a86a',
      goldSoft: '#e2cfa0',
      goldForeground: '#2a2410',
      maroon: '#0f5132',
      maroonDeep: '#0a3a24',
    },
  },
  {
    id: 'sapphire',
    label: 'Sapphire',
    colors: {
      background: '#f9fbfd',
      foreground: '#1c2733',
      card: '#ffffff',
      cardForeground: '#1c2733',
      primary: '#1e3a5f',
      primaryForeground: '#f2f6fb',
      secondary: '#eef2f7',
      secondaryForeground: '#1e3a5f',
      muted: '#eef2f7',
      mutedForeground: '#5c6672',
      accent: '#c0a063',
      accentForeground: '#2a2310',
      border: '#dce4ee',
      input: '#dce4ee',
      ring: '#c0a063',
      destructive: '#c0392b',
      gold: '#c0a063',
      goldSoft: '#ddc79a',
      goldForeground: '#2a2310',
      maroon: '#1e3a5f',
      maroonDeep: '#14273f',
    },
  },
  {
    id: 'onyx',
    label: 'Onyx & Gold',
    colors: {
      background: '#fafafa',
      foreground: '#1c1c1e',
      card: '#ffffff',
      cardForeground: '#1c1c1e',
      primary: '#1f1f22',
      primaryForeground: '#f5f4f2',
      secondary: '#f2f2f1',
      secondaryForeground: '#1f1f22',
      muted: '#f2f2f1',
      mutedForeground: '#6b6b6b',
      accent: '#c5a880',
      accentForeground: '#2a2410',
      border: '#e6e6e4',
      input: '#e6e6e4',
      ring: '#c5a880',
      destructive: '#c0392b',
      gold: '#c5a880',
      goldSoft: '#ddc9a8',
      goldForeground: '#2a2410',
      maroon: '#1f1f22',
      maroonDeep: '#101012',
    },
  },
  {
    id: 'plum',
    label: 'Plum & Champagne',
    colors: {
      background: '#fdfbfd',
      foreground: '#2c1f2e',
      card: '#ffffff',
      cardForeground: '#2c1f2e',
      primary: '#4a1d4f',
      primaryForeground: '#f8f3f7',
      secondary: '#f4eef3',
      secondaryForeground: '#4a1d4f',
      muted: '#f4eef3',
      mutedForeground: '#6b5f6a',
      accent: '#caa96d',
      accentForeground: '#2e2410',
      border: '#e9e1e8',
      input: '#e9e1e8',
      ring: '#caa96d',
      destructive: '#c0392b',
      gold: '#caa96d',
      goldSoft: '#e4d2a6',
      goldForeground: '#2e2410',
      maroon: '#4a1d4f',
      maroonDeep: '#331335',
    },
  },
  {
    id: 'petrol',
    label: 'Petrol & Copper',
    colors: {
      background: '#f8fbfb',
      foreground: '#18292b',
      card: '#ffffff',
      cardForeground: '#18292b',
      primary: '#0d3b42',
      primaryForeground: '#eef6f5',
      secondary: '#ebf3f2',
      secondaryForeground: '#0d3b42',
      muted: '#ebf3f2',
      mutedForeground: '#566366',
      accent: '#c47a54',
      accentForeground: '#2c1409',
      border: '#dde9e7',
      input: '#dde9e7',
      ring: '#c47a54',
      destructive: '#c0392b',
      gold: '#c47a54',
      goldSoft: '#e4b79b',
      goldForeground: '#2c1409',
      maroon: '#0d3b42',
      maroonDeep: '#082a30',
    },
  },
]

/** Finds the preset whose colours all match the current theme, if any. */
export function matchPreset(theme: Theme): string | null {
  for (const preset of THEME_PRESETS) {
    if (COLOR_TOKEN_KEYS.every((key) => theme[key]?.toLowerCase() === preset.colors[key]?.toLowerCase())) {
      return preset.id
    }
  }
  return null
}

export type { Theme }
