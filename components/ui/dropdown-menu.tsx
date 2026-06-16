'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

/**
 * Dropdown rendered into a portal on <body> with fixed positioning, so it can never
 * be clipped by an ancestor's `overflow` (e.g. the table/card wrapper). Position is
 * derived from the trigger's bounding box and recomputed on scroll/resize, with a
 * flip-up fallback when there isn't room below.
 */
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
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => setMounted(true), [])

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }
    const compute = () => {
      const trig = triggerRef.current?.getBoundingClientRect()
      if (!trig) return
      const menuW = menuRef.current?.offsetWidth ?? 160
      const menuH = menuRef.current?.offsetHeight ?? 0
      const margin = 8

      let left = align === 'end' ? trig.right - menuW : trig.left
      left = Math.max(margin, Math.min(left, window.innerWidth - menuW - margin))

      let top = trig.bottom + 6
      // Flip above the trigger if it would overflow the viewport bottom.
      if (top + menuH > window.innerHeight - margin) {
        top = Math.max(margin, trig.top - menuH - 6)
      }

      setPos({ top, left })
    }

    compute()
    window.addEventListener('scroll', compute, true)
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute, true)
      window.removeEventListener('resize', compute)
    }
  }, [open, align])

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (menuRef.current?.contains(target)) return
      onOpenChange(false)
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
    <div ref={triggerRef} className="inline-block">
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open &&
        mounted &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={
              pos
                ? { position: 'fixed', top: pos.top, left: pos.left }
                : { position: 'fixed', top: 0, left: 0, visibility: 'hidden' }
            }
            className="z-50 min-w-[10rem] overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}

const menuItemCls = (className?: string) =>
  cn(
    'flex w-full items-center px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-surface-sunken disabled:opacity-50',
    className,
  )

export function DropdownMenuItem({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" role="menuitem" className={menuItemCls(className)} {...props}>
      {children}
    </button>
  )
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="my-1 border-t border-border" />
}

export function DropdownMenuLink({
  className,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a role="menuitem" className={menuItemCls(className)} {...props}>
      {children}
    </a>
  )
}
