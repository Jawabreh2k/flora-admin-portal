/**
 * Mirrors the Flora CMS API contract (Flora.Cms.Api/Dtos).
 * SYNC: flora-group-website/lib/ui-config/types.ts, DefaultContent.cs, messages.ts
 * Checklist: docs/CMS_CONTRACT_SYNC.md
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
  contactHero: string
  careersHero: string
}

export type SocialPlatform = 'linkedin' | 'instagram' | 'facebook' | 'x' | 'youtube'

export type SocialLink = {
  platform: SocialPlatform
  url: string
}

export type Social = {
  enabled: boolean
  links: SocialLink[]
}

export const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string }[] = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X (Twitter)' },
  { id: 'youtube', label: 'YouTube' },
]

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
  spotlight: {
    eyebrow: string
    title: string
    description: string
    technologyImage: string
    technologyLogo: string
    securityImage: string
    securityLogo: string
  }

  nav: {
    home: string
    legacy: string
    subsidiaries: string
    spotlight: string
    careers: string
    contact: string
    getInTouch: string
    openMenu: string
    closeMenu: string
    languageName: string
    switchTo: string
  }

  stats: {
    established: string
    verticals: string
    certified: string
    countries: string
    establishedValue: string
    verticalsValue: string
    certifiedValue: string
    countriesValue: string
  }

  pages: {
    contactMetaTitle: string
    contactMetaDescription: string
    careersMetaTitle: string
    careersMetaDescription: string
  }

  footer: {
    careersTitle: string
    careersBody: string
    exploreCareers: string
    about: string
    address: string
    newsletter: string
    tagline: string
    phone: string
    phoneDisplay: string
    email: string
    mapsUrl: string
    companyName: string
    subsidiariesHeading: string
    headOfficeHeading: string
    openInMaps: string
    globalInquiries: string
    rightsText: string
    emailPlaceholder: string
    subscribed: string
  }

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
    ourOffices: string
    phone: string
    fax: string
    headOfficeAddress: string
    headOfficePhone: string
    headOfficeFax: string
    headOfficeEmail: string
    flowersOfficeAddress: string
    flowersOfficePhone: string
    flowersOfficeFax: string
    flowersOfficeEmail: string
    mapLocation: string
    mapEmbedUrl: string
    mapTitle: string
    formRecipientEmail: string
    fullName: string
    email: string
    company: string
    subject: string
    message: string
    messagePlaceholder: string
    send: string
    formSuccessTitle: string
    formSuccessBody: string
    sendAnother: string
    formErrorMessage: string
    required: string
  }

  careersHero: { eyebrow: string; title: string; subtitle: string; viewRoles: string; generalApply: string }
  careersCulture: { eyebrow: string; title: string; description: string }
  careersBenefits: { eyebrow: string; title: string }
  careersPositions: { eyebrow: string; title: string; description: string }
  careersCta: { title: string; body: string; email: string; button: string }
  careersStats: {
    years: string
    verticals: string
    partners: string
    team: string
    yearsValue: string
    verticalsValue: string
    partnersValue: string
    teamValue: string
  }
  careersCultureValues: {
    value1Title: string
    value1Body: string
    value2Title: string
    value2Body: string
    value3Title: string
    value3Body: string
    value4Title: string
    value4Body: string
  }
  careersUi: {
    filterLocation: string
    filterJobType: string
    searchPlaceholder: string
    showingRoles: string
    previous: string
    next: string
    loading: string
    loadError: string
  }
}

export type LocalizedContent = Record<Locale, EditableContent>

export type Highlight = { title: string; body: string }
export type Metric = { value: string; label: string }

export type SubsidiaryContact = {
  address: Localized<string>
  phone?: string
  fax?: string
  email?: string
}

export type ManagedSubsidiary = {
  slug: string
  icon: string
  name: Localized<string>
  tag: Localized<string>
  short: Localized<string>
  established: Localized<string>
  visual: { from: string; to: string; glow: string }
  image?: string
  logo?: string
  paragraphs: Localized<string[]>
  highlights: Localized<Highlight[]>
  metrics: Localized<Metric[]>
  website: string
  hasProfile: boolean
  contact: SubsidiaryContact
  /** Hides the subsidiary from the public site without deleting it. Missing/undefined means visible. */
  enabled?: boolean
}

export type Localized<T> = Record<Locale, T>

export const ICON_PRESETS = [
  'Package',
  'Cpu',
  'ShieldCheck',
  'Flower2',
  'Building2',
  'Sprout',
] as const

export type UiConfigPayload = {
  theme: Theme
  branding: Branding
  sections: Sections
  images: Images
  content: LocalizedContent
  social?: Social
  subsidiaries?: {
    enabled: boolean
    items: ManagedSubsidiary[]
  }
}

/** Drives the generated content-editor forms. `page` is a display-only grouping header. */
export const CONTENT_SCHEMA: {
  page: string
  group: keyof EditableContent
  label: string
  fields: { key: string; label: string; multiline?: boolean; hint?: string }[]
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
      { key: 'technologyImage', label: 'Technology cover image URL' },
      { key: 'technologyLogo', label: 'Technology logo URL' },
      { key: 'securityImage', label: 'Security cover image URL' },
      { key: 'securityLogo', label: 'Security logo URL' },
    ],
  },
  {
    page: 'Global',
    group: 'nav',
    label: 'Navigation labels',
    fields: [
      { key: 'home', label: 'Home' },
      { key: 'legacy', label: 'Our Legacy' },
      { key: 'subsidiaries', label: 'Subsidiaries' },
      { key: 'spotlight', label: 'Spotlight' },
      { key: 'careers', label: 'Careers' },
      { key: 'contact', label: 'Contact' },
      { key: 'getInTouch', label: 'Get in Touch button' },
      { key: 'openMenu', label: 'Open menu (a11y)' },
      { key: 'closeMenu', label: 'Close menu (a11y)' },
      { key: 'languageName', label: 'Language toggle label' },
      { key: 'switchTo', label: 'Switch language (a11y)' },
    ],
  },
  {
    page: 'Global',
    group: 'stats',
    label: 'Homepage stats band',
    fields: [
      { key: 'established', label: 'Established label' },
      { key: 'establishedValue', label: 'Established value', hint: 'Number or text (e.g. 1993)' },
      { key: 'verticals', label: 'Verticals label' },
      { key: 'verticalsValue', label: 'Verticals value' },
      { key: 'certified', label: 'Certified label' },
      { key: 'certifiedValue', label: 'Certified value', hint: 'Number or text (e.g. MOI)' },
      { key: 'countries', label: 'Countries label' },
      { key: 'countriesValue', label: 'Countries value', hint: 'Include suffix like 26+' },
    ],
  },
  {
    page: 'Global',
    group: 'pages',
    label: 'Page metadata (SEO)',
    fields: [
      { key: 'contactMetaTitle', label: 'Contact page title' },
      { key: 'contactMetaDescription', label: 'Contact page description', multiline: true },
      { key: 'careersMetaTitle', label: 'Careers page title' },
      { key: 'careersMetaDescription', label: 'Careers page description', multiline: true },
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
      { key: 'address', label: 'Office address', multiline: true },
      { key: 'phone', label: 'Phone (tel link)', hint: 'Digits only for tel: link, e.g. +97444810674' },
      { key: 'phoneDisplay', label: 'Phone (display)', hint: 'Formatted for display, e.g. +974 4481 0674' },
      { key: 'email', label: 'Email address' },
      { key: 'mapsUrl', label: 'Google Maps URL', hint: 'Full https:// URL' },
      { key: 'companyName', label: 'Company name (copyright)' },
      { key: 'subsidiariesHeading', label: 'Subsidiaries heading' },
      { key: 'headOfficeHeading', label: 'Head office heading' },
      { key: 'openInMaps', label: 'Open in Maps label' },
      { key: 'globalInquiries', label: 'Newsletter heading' },
      { key: 'newsletter', label: 'Newsletter prompt', multiline: true },
      { key: 'emailPlaceholder', label: 'Newsletter placeholder' },
      { key: 'subscribed', label: 'Newsletter success message' },
      { key: 'rightsText', label: 'Rights reserved text' },
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
    label: 'Head office',
    fields: [
      { key: 'headOfficeName', label: 'Office name' },
      { key: 'headOfficeAddress', label: 'Address', multiline: true },
      { key: 'headOfficePhone', label: 'Phone' },
      { key: 'headOfficeFax', label: 'Fax' },
      { key: 'headOfficeEmail', label: 'Email' },
    ],
  },
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Flowers & Sibonne office',
    fields: [
      { key: 'flowersOfficeName', label: 'Office name' },
      { key: 'flowersOfficeAddress', label: 'Address', multiline: true },
      { key: 'flowersOfficePhone', label: 'Phone' },
      { key: 'flowersOfficeFax', label: 'Fax' },
      { key: 'flowersOfficeEmail', label: 'Email' },
    ],
  },
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Location & map',
    fields: [
      {
        key: 'mapLocation',
        label: 'Map location',
        hint: 'Paste a Google Maps link, type an address, or enter coordinates as "lat, lng" (e.g. 25.2854, 51.5310). A live preview appears below.',
      },
      { key: 'mapTitle', label: 'Map accessibility title', hint: 'Describes the map for screen readers' },
      { key: 'hoursDays', label: 'Working days' },
      { key: 'hoursTime', label: 'Working hours' },
      { key: 'ourOffices', label: 'Offices section heading' },
      { key: 'phone', label: 'Phone label' },
      { key: 'fax', label: 'Fax label' },
    ],
  },
  {
    page: 'Contact page',
    group: 'contact',
    label: 'Contact form',
    fields: [
      { key: 'sendTitle', label: 'Form heading' },
      { key: 'sendHelp', label: 'Form helper text', multiline: true },
      { key: 'fullName', label: 'Full name label' },
      { key: 'email', label: 'Email label' },
      { key: 'company', label: 'Company label' },
      { key: 'subject', label: 'Subject label' },
      { key: 'message', label: 'Message label' },
      { key: 'messagePlaceholder', label: 'Message placeholder' },
      { key: 'send', label: 'Submit button' },
      { key: 'formSuccessTitle', label: 'Success title' },
      { key: 'formSuccessBody', label: 'Success message', multiline: true },
      { key: 'formErrorMessage', label: 'Error message' },
      { key: 'sendAnother', label: 'Send another label' },
      { key: 'required', label: 'Required field hint' },
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
  {
    page: 'Careers page',
    group: 'careersStats',
    label: 'Stats numbers',
    fields: [
      { key: 'years', label: 'Years label' },
      { key: 'yearsValue', label: 'Years value', hint: 'e.g. 30+' },
      { key: 'verticals', label: 'Verticals label' },
      { key: 'verticalsValue', label: 'Verticals value' },
      { key: 'partners', label: 'Partners label' },
      { key: 'partnersValue', label: 'Partners value' },
      { key: 'team', label: 'Team label' },
      { key: 'teamValue', label: 'Team value' },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersCultureValues',
    label: 'Culture value cards',
    fields: [
      { key: 'value1Title', label: 'Card 1 title' },
      { key: 'value1Body', label: 'Card 1 body', multiline: true },
      { key: 'value2Title', label: 'Card 2 title' },
      { key: 'value2Body', label: 'Card 2 body', multiline: true },
      { key: 'value3Title', label: 'Card 3 title' },
      { key: 'value3Body', label: 'Card 3 body', multiline: true },
      { key: 'value4Title', label: 'Card 4 title' },
      { key: 'value4Body', label: 'Card 4 body', multiline: true },
    ],
  },
  {
    page: 'Careers page',
    group: 'careersUi',
    label: 'Job board UI',
    fields: [
      { key: 'filterLocation', label: 'Location filter label' },
      { key: 'filterJobType', label: 'Job type filter label' },
      { key: 'searchPlaceholder', label: 'Search placeholder' },
      { key: 'showingRoles', label: 'Results count (use {shown} and {total})' },
      { key: 'previous', label: 'Previous button' },
      { key: 'next', label: 'Next button' },
      { key: 'loading', label: 'Loading message' },
      { key: 'loadError', label: 'Error message' },
    ],
  },
]

export type UiConfigResponse = {
  payload: UiConfigPayload
  revision: number
  updatedAtUtc: string
  updatedBy: string | null
}

/** One entry in the config version history (for the rollback UI). */
export type RevisionSummary = {
  revision: number
  savedAtUtc: string
  savedBy: string | null
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
