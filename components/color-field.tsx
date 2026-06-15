'use client'

import { humanizeKey } from '@/lib/utils'

export function ColorField({
  name,
  value,
  onChange,
}: {
  name: string
  value: string
  onChange: (value: string) => void
}) {
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-sunken/50 px-4 py-3 transition-colors hover:bg-surface-sunken">
      <span className="text-sm text-foreground">{humanizeKey(name)}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${humanizeKey(name)} colour picker`}
          value={isHex ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="size-8 shrink-0 cursor-pointer rounded-lg border border-border bg-white p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-28 rounded-lg border border-border bg-surface px-2 py-1.5 font-mono text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
      </span>
    </label>
  )
}
