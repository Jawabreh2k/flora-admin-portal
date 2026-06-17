'use client'

import { Check, RotateCcw, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  contrastRatio,
  gradeContrast,
  isHexColor,
  type ColorTokenKey,
  type ContrastGrade,
  type TokenMeta,
} from '@/lib/theme-tokens'

function ContrastBadge({ grade }: { grade: ContrastGrade }) {
  return (
    <span
      title={`Text contrast ${grade.ratio.toFixed(2)}:1 — ${grade.pass ? 'meets' : 'below'} WCAG AA for normal text`}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
        grade.pass ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning',
      )}
    >
      {grade.pass ? <Check className="size-2.5" /> : <TriangleAlert className="size-2.5" />}
      {grade.label}
    </span>
  )
}

export function ColorField({
  token,
  meta,
  value,
  pairValue,
  defaultValue,
  active,
  onChange,
  onHover,
}: {
  token: ColorTokenKey
  meta: TokenMeta
  value: string
  /** Current value of the surface this text sits on, for the contrast badge. */
  pairValue?: string
  /** Factory default for this token — enables the per-row revert button. */
  defaultValue?: string
  active?: boolean
  onChange: (value: string) => void
  onHover?: (on: boolean) => void
}) {
  const hex = isHexColor(value)
  const ratio = meta.pairWith && pairValue ? contrastRatio(value, pairValue) : null
  const grade = ratio != null ? gradeContrast(ratio) : null
  const changed = defaultValue != null && value.toLowerCase() !== defaultValue.toLowerCase()

  return (
    <div
      data-token={token}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150',
        active ? 'bg-cyan-50/70 shadow-sm ring-2 ring-cyan-400' : 'hover:bg-surface-sunken',
      )}
    >
      {/* Swatch — clicking anywhere on it opens the native picker */}
      <div className="relative shrink-0">
        <span
          aria-hidden
          className="block size-9 rounded-lg shadow-inner ring-1 ring-black/10"
          style={{ background: value || '#ffffff' }}
        />
        <input
          type="color"
          aria-label={`${meta.label} colour picker`}
          value={hex ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => onHover?.(true)}
          onBlur={() => onHover?.(false)}
          className="absolute inset-0 size-9 cursor-pointer opacity-0"
        />
      </div>

      {/* Name + what it controls */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">{meta.label}</span>
          <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium text-subtle transition-colors group-hover:bg-white">
            {meta.usedIn}
          </span>
          {grade && <ContrastBadge grade={grade} />}
        </div>
        <p className="mt-0.5 text-xs leading-snug text-muted">{meta.description}</p>
      </div>

      {/* Revert to default */}
      <button
        type="button"
        onClick={() => defaultValue != null && onChange(defaultValue)}
        title={changed ? `Revert to default (${defaultValue})` : 'Matches default'}
        aria-label={`Revert ${meta.label} to default`}
        disabled={!changed}
        className={cn(
          'grid size-7 shrink-0 place-items-center rounded-md transition-all',
          changed
            ? 'text-muted hover:bg-surface-sunken hover:text-foreground'
            : 'pointer-events-none opacity-0',
        )}
      >
        <RotateCcw className="size-3.5" />
      </button>

      {/* Hex value */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onHover?.(true)}
        onBlur={() => onHover?.(false)}
        spellCheck={false}
        aria-label={`${meta.label} value`}
        className={cn(
          'w-24 shrink-0 rounded-lg border bg-surface px-2 py-1.5 text-center font-mono text-xs outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15',
          hex ? 'border-border' : 'border-amber-300 text-amber-700',
        )}
      />
    </div>
  )
}
