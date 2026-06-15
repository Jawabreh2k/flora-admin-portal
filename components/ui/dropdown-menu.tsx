'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export function DropdownMenu({
  open,
  onOpenChange,
  trigger,
  children,
  align = 'end',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'start' | 'end'
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOpenChange(false)
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onOpenChange])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-50 mt-1.5 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg',
            align === 'end' ? 'end-0' : 'start-0',
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownMenuItem({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        'flex w-full items-center px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-sunken disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
