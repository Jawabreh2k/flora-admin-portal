'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'flora-admin-theme'

type ThemeContextValue = { dark: boolean; toggle: () => void }

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Single source of truth for dark mode. Multiple <ThemeToggle> instances can
 * be mounted at once (desktop sidebar + mobile header, both always in the DOM
 * just responsively hidden) — without a shared context each would keep its
 * own stale `dark` flag and could toggle in the wrong direction.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    setDark((prev) => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light')
      return next
    })
  }

  return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
