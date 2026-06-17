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
  type = 'text',
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  mono?: boolean
  dir?: 'ltr' | 'rtl'
  placeholder?: string
  type?: 'text' | 'password' | 'email' | 'number'
  autoComplete?: string
}) {
  return (
    <input
      type={type}
      value={value}
      dir={dir}
      placeholder={placeholder}
      autoComplete={autoComplete}
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

export function Switch({
  checked,
  onChange,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  onChange: () => void
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        'box-border inline-flex h-6 w-11 shrink-0 cursor-pointer appearance-none items-center rounded-full border-0 p-0.5 outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2',
        checked ? 'bg-brand' : 'bg-border',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none block size-5 shrink-0 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
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
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-sunken/50">
      <span className="min-w-0 flex-1 text-sm text-foreground">{label}</span>
      <div className="flex shrink-0 items-center">
        <Switch checked={checked} onChange={onChange} aria-label={label || undefined} />
      </div>
    </div>
  )
}

export function RadioGroup({
  value,
  onChange,
  options,
  direction = 'vertical',
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; hint?: string }[]
  direction?: 'vertical' | 'horizontal'
}) {
  return (
    <div className={cn('flex gap-2', direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col')}>
      {options.map((option) => (
        <label key={option.value} className="flex cursor-pointer items-start gap-2.5">
          <input
            type="radio"
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand"
          />
          <div>
            <span className="text-sm font-medium text-foreground">{option.label}</span>
            {option.hint && <p className="text-xs text-muted">{option.hint}</p>}
          </div>
        </label>
      ))}
    </div>
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
