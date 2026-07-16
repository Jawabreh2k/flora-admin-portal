'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'

/** Full-width labelled row — used in the sidebar's bottom section. */
export function ThemeToggle({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground',
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-surface-sunken">
        {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </span>
      {dark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}

/** Icon-only variant — used in the mobile header, always reachable without opening the drawer. */
export function ThemeToggleCompact({ className }: { className?: string }) {
  const { dark, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-sunken hover:text-foreground',
        className,
      )}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}
