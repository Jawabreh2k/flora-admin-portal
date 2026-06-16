'use client'

import {
  Building2,
  Image as ImageIcon,
  LayoutGrid,
  Mail,
  Palette,
  Share2,
  Tag,
  Type,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfigSectionId =
  | 'appearance'
  | 'content'
  | 'media'
  | 'branding'
  | 'email'
  | 'social'
  | 'layout'
  | 'subsidiaries'

type SectionDef = {
  id: ConfigSectionId
  label: string
  description: string
  icon: LucideIcon
}

export const CONFIG_SECTIONS: SectionDef[] = [
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Colors & typography' },
  { id: 'content', label: 'Content', icon: Type, description: 'Page copy & text' },
  { id: 'media', label: 'Media', icon: ImageIcon, description: 'Logos & imagery' },
  { id: 'branding', label: 'Branding', icon: Tag, description: 'Site metadata' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Inboxes & display addresses' },
  { id: 'social', label: 'Social', icon: Share2, description: 'Footer social links' },
  { id: 'subsidiaries', label: 'Subsidiaries', icon: Building2, description: 'Company profiles' },
  { id: 'layout', label: 'Layout', icon: LayoutGrid, description: 'Section visibility' },
]

export function getConfigSection(id: ConfigSectionId) {
  return CONFIG_SECTIONS.find((s) => s.id === id)!
}

function SectionButton({
  section,
  active,
  onSelect,
  compact,
}: {
  section: SectionDef
  active: boolean
  onSelect: (id: ConfigSectionId) => void
  compact?: boolean
}) {
  const Icon = section.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(section.id)}
      className={cn(
        'flex items-center gap-2.5 rounded-xl text-left transition-colors duration-150',
        compact ? 'shrink-0 px-3 py-2' : 'w-full px-3 py-2.5',
        active
          ? 'bg-brand text-white shadow-sm'
          : 'text-muted hover:bg-surface-sunken hover:text-foreground',
      )}
    >
      <span
        className={cn(
          'grid shrink-0 place-items-center rounded-lg transition-colors',
          compact ? 'size-7' : 'size-8',
          active ? 'bg-white/15' : 'bg-surface-sunken',
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>{section.label}</span>
    </button>
  )
}

export function ConfigSectionNav({
  active,
  onChange,
}: {
  active: ConfigSectionId
  onChange: (id: ConfigSectionId) => void
}) {
  return (
    <>
      {/* Mobile: scrollable chips */}
      <div className="lg:hidden">
        <div className="flex gap-1.5 overflow-x-auto rounded-xl border border-border bg-surface p-1.5 shadow-sm scrollbar-thin">
          {CONFIG_SECTIONS.map((section) => (
            <SectionButton
              key={section.id}
              section={section}
              active={active === section.id}
              onSelect={onChange}
              compact
            />
          ))}
        </div>
      </div>

      {/* Desktop: clean vertical nav */}
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1 rounded-2xl border border-border bg-surface p-2 shadow-sm">
          <p className="px-3 pb-1 pt-2 text-xs font-medium text-subtle">Sections</p>
          <ul className="space-y-0.5">
            {CONFIG_SECTIONS.map((section) => (
              <li key={section.id}>
                <SectionButton
                  section={section}
                  active={active === section.id}
                  onSelect={onChange}
                />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  )
}
