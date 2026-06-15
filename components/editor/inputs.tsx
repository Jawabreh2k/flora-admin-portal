'use client'

import { cn } from '@/lib/utils'

export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-subtle">{hint}</p>}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  mono,
  dir,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  mono?: boolean
  dir?: 'ltr' | 'rtl'
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      dir={dir}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      spellCheck={false}
      className={cn(
        'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-brand focus:ring-2 focus:ring-brand/15',
        mono && 'font-mono text-xs',
      )}
    />
  )
}

export function TextArea({
  value,
  onChange,
  dir,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  dir?: 'ltr' | 'rtl'
  rows?: number
}) {
  return (
    <textarea
      value={value}
      dir={dir}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm shadow-sm transition-colors outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
    />
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-sunken/50">
      <span className="text-sm text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  )
}

export function Card({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description && <p className="mb-4 mt-0.5 text-xs text-muted">{description}</p>}
      <div className={description ? '' : 'mt-4'}>{children}</div>
    </section>
  )
}
