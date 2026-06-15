/**
 * Mirrors the Flora CMS API contract (Flora.Cms.Api/Dtos). Kept in sync with the
 * backend; the public site has its own copy of these types.
 */

export type Theme = {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  border: string
  input: string
  ring: string
  destructive: string
  gold: string
  goldSoft: string
  goldForeground: string
  maroon: string
  maroonDeep: string
  radius: string
  fontHeading: string
  fontSans: string
}

export type Branding = {
  siteTitle: string
  metaDescription: string
  logoUrl: string
  themeColor: string
}

export type Sections = {
  showStats: boolean
  showSubsidiaries: boolean
  showSpotlight: boolean
}

export type Images = {
  logo: string
  heroImage: string
}

export type Locale = 'en' | 'ar'
export const LOCALES: Locale[] = ['en', 'ar']
export const LOCALE_LABELS: Record<Locale, string> = { en: 'English', ar: 'العربية' }

/** All CMS-editable copy, flat per group, mirrored per locale. */
export type EditableContent = {
  // --- Homepage ---
  hero: {
    badge: string
    titleA: string
    titleHighlight: string
    titleB: string
    subtitle: string
    ctaExplore: string
    ctaProfile: string
    caption: string
    cardVerticals: string
    cardYears: string
  }
  subsidiaries: { eyebrow: string; title: string; description: string; explore: string }
  spotlight: { eyebrow: string; title: string; description: string }

  // --- Footer ---
  footer: {
    careersTitle: string
    careersBody: string
    exploreCareers: string
    about: string
    address: string
    newsletter: string
    tagline: string
  }

  // --- Contact page ---
  contact: {
    eyebrow: string
    title: string
    subtitle: string
    headOfficeName: string
    flowersOfficeName: string
    hoursDays: string
    hoursTime: string
    sendTitle: string
    sendHelp: string
  }

  // --- Careers page (flat sub-groups mapped to careers.* in Messages) ---
  careersHero: { eyebrow: string; title: string; subtitle: string; viewRoles: string; generalApply: string }
  careersCulture: { eyebrow: string; title: string; description: string }
  careersBenefits: { eyebrow: string; title: string }
  careersPositions: { eyebrow: string; title: string; description: string }
  careersCta: { title: string; body: string; email: string; button: string }
}

export type LocalizedContent = Record<Locale, EditableContent>

export type UiConfigPayload = {
  theme: Theme
  branding: Branding
  sections: Sections
  images: Images
  content: LocalizedContent
}

/** Drives the generated content-editor forms. `page` is a display-only grouping header. */
export const CONTENT_SCHEMA: {
  page: string
  group: keyof EditableContent
  label: string
  fields: { key: string; label: string; multiline?: boolean }[]
}[] = [
  // ── Homepage ─────────────────────────────────────────────────────────────
  {
    page: 'Homepage',
    group: 'hero',
    label: 'Hero',
    fields: [
      { key: 'badge', label: 'Badge' },
      { key: 'titleA', label: 'Title — line 1' },
      { key: 'titleHighlight', label: 'Title — highlighted words' },
      { key: 'titleB', label: 'Title — line 2' },
      { key: 'subtitle', label: 'Subtitle', multiline: true },
      { key: 'ctaExplore', label: 'Primary button' },
      { key: 'ctaProfile', label: 'Secondary button' },
      { key: 'caption', label: 'Image caption' },
      { key: 'cardVerticals', label: 'Stat card — verticals label' },
      { key: 'cardYears', label: 'Stat card — years label' },
    ],
  },
  {
    page: 'Homepage',
    group: 'subsidiaries',
    label: 'Subsidiaries section',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
      { key: 'explore', label: 'Explore label' },
    ],
  },
  {
    page: 'Homepage',
    group: 'spotlight',
    label: 'Spotlight section',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },

  // ── Footer ────────────────────────────────────────────────────────────────
  {
    page: 'Footer',
    group: 'footer',
    label: 'Careers band',
    fields: [
      { key: 'careersTitle', label: 'Careers heading' },
      { key: 'careersBody', label: 'Careers body', multiline: true },
      { key: 'exploreCareers', label: 'Button label' },
    ],
  },
  {
    page: 'Footer',
    group: 'footer',
    label: 'About & contact strip',
    fields: [
      { key: 'about', label: 'About blurb', multiline: true },
      { key: 'address', label: 'Office address' },
      { key: 'newsletter', label: 'Newsletter prompt' },
      { key: 'tagline', label: 'Tagline (bottom bar)' },
    ],
  },

  // ── Contact page ─────────────────────────────────────────────────────────
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Hero',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle', multiline: true },
    ],
  },
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Office details',
    fields: [
      { key: 'headOfficeName', label: 'Head office name' },
      { key: 'flowersOfficeName', label: 'Flowers office name' },
      { key: 'hoursDays', label: 'Working days' },
      { key: 'hoursTime', label: 'Working hours' },
    ],
  },
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Contact form',
    fields: [
      { key: 'sendTitle', label: 'Form heading' },
      { key: 'sendHelp', label: 'Form helper text', multiline: true },
    ],
  },

  // ── Careers page ─────────────────────────────────────────────────────────
  {
    page: 'Careers page',
    group: 'careersHero',
    label: 'Hero',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'subtitle', label: 'Subtitle', multiline: true },
      { key: 'viewRoles', label: 'Primary button' },
      { key: 'generalApply', label: 'Secondary button' },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersCulture',
    label: 'Culture section',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersBenefits',
    label: 'Benefits section',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersPositions',
    label: 'Open positions section',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow' },
      { key: 'title', label: 'Title' },
      { key: 'description', label: 'Description', multiline: true },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersCta',
    label: 'CTA band',
    fields: [
      { key: 'title', label: 'Heading' },
      { key: 'body', label: 'Body', multiline: true },
      { key: 'email', label: 'HR email address' },
      { key: 'button', label: 'Button label' },
    ],
  },
]

export type UiConfigResponse = {
  payload: UiConfigPayload
  revision: number
  updatedAtUtc: string
  updatedBy: string | null
}

export type AuthResponse = {
  accessToken: string
  tokenType: string
  expiresAtUtc: string
  username: string
  role: string
}

/** Colour token keys grouped for a friendlier editor layout. */
export const COLOR_GROUPS: {
  label: string
  keys: (keyof Theme)[]
}[] = [
  {
    label: 'Brand',
    keys: ['primary', 'primaryForeground', 'maroon', 'maroonDeep', 'gold', 'goldSoft', 'goldForeground'],
  },
  {
    label: 'Surfaces',
    keys: ['background', 'foreground', 'card', 'cardForeground', 'muted', 'mutedForeground'],
  },
  {
    label: 'Accents & UI',
    keys: ['secondary', 'secondaryForeground', 'accent', 'accentForeground', 'border', 'input', 'ring', 'destructive'],
  },
]
