'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart3,
  Briefcase,
  ExternalLink,
  Inbox,
  LayoutGrid,
  LogOut,
  MailPlus,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

const MAIN_NAV = [
  {
    href: '/dashboard/overview',
    label: 'Overview',
    description: 'Site activity at a glance',
    icon: BarChart3,
    match: (path: string) => path.startsWith('/dashboard/overview'),
  },
  {
    href: '/dashboard',
    label: 'Site Config',
    description: 'Theme, content & layout',
    icon: LayoutGrid,
    match: (path: string) => path === '/dashboard',
  },
  {
    href: '/dashboard/jobs',
    label: 'Job Board',
    description: 'Roles & applications',
    icon: Briefcase,
    match: (path: string) => path.startsWith('/dashboard/jobs'),
  },
  {
    href: '/dashboard/inquiries',
    label: 'Inquiries',
    description: 'Contact form messages',
    icon: Inbox,
    match: (path: string) => path.startsWith('/dashboard/inquiries'),
  },
  {
    href: '/dashboard/subscribers',
    label: 'Subscribers',
    description: 'Newsletter signups',
    icon: MailPlus,
    match: (path: string) => path.startsWith('/dashboard/subscribers'),
  },
] as const

function NavLink({
  href,
  label,
  description,
  icon: Icon,
  active,
  badge,
  onClick,
}: {
  href: string
  label: string
  description: string
  icon: typeof LayoutGrid
  active: boolean
  badge?: number
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150',
        active
          ? 'bg-brand text-white shadow-sm'
          : 'text-muted hover:bg-surface-sunken hover:text-foreground',
      )}
    >
      <span
        className={cn(
          'grid size-9 shrink-0 place-items-center rounded-lg transition-colors',
          active ? 'bg-white/15' : 'bg-surface-sunken group-hover:bg-white',
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium leading-tight">{label}</span>
        <span
          className={cn(
            'block truncate text-[11px] leading-tight',
            active ? 'text-white/70' : 'text-subtle',
          )}
        >
          {description}
        </span>
      </span>
      {typeof badge === 'number' && badge > 0 && (
        <span
          className={cn(
            'ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
            active ? 'bg-white/20 text-white' : 'bg-brand text-white',
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  // Live unread-inquiry count for the nav badge. Shares its cache key with the
  // inbox page, so triaging there updates the badge instantly (and vice versa).
  const { data: inquirySummary } = useQuery({
    queryKey: ['admin-inquiries-summary'],
    queryFn: async () => {
      const res = await fetch('/api/inquiries/summary')
      if (!res.ok) throw new Error('Failed to load inquiry summary')
      return res.json() as Promise<{ total: number; unread: number }>
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const logout = async () => {
    await fetch('/api/session', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="grid size-10 place-items-center rounded-xl bg-brand text-sm font-bold text-white shadow-sm">
          F
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Flora CMS</p>
          <p className="text-[11px] text-subtle">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-subtle">
          Workspace
        </p>
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            active={item.match(pathname)}
            badge={item.href === '/dashboard/inquiries' ? inquirySummary?.unread : undefined}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <a
          href={PUBLIC_SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-surface-sunken hover:text-foreground"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-surface-sunken">
            <ExternalLink className="size-4" />
          </span>
          View live site
        </a>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-danger-bg hover:text-danger"
        >
          <span className="grid size-9 place-items-center rounded-lg bg-surface-sunken">
            <LogOut className="size-4" />
          </span>
          Sign out
        </button>
      </div>
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-surface-sunken">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-surface shadow-lg">
            <div className="absolute end-3 top-3">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur-md lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <span className="text-sm font-semibold text-foreground">Flora CMS</span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  )
}
