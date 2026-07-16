import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

const variants = {
  default: 'border-border bg-surface text-foreground',
  success: 'border-emerald-200 dark:border-emerald-900/40 bg-success-bg text-success',
  warning: 'border-amber-200 dark:border-amber-900/40 bg-warning-bg text-warning',
  danger: 'border-red-200 dark:border-red-900/40 bg-danger-bg text-danger',
  info: 'border-blue-200 dark:border-blue-900/40 bg-info-bg text-info',
} as const

export function Alert({
  variant = 'default',
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: keyof typeof variants }) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-sunken/50 px-6 py-16 text-center">
      <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-brand-muted text-brand">
        <Icon className="size-6" />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
