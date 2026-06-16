'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { THEME_REGISTRY, DEFAULT_THEME_ID, getThemeById, type ThemeConfig } from './themes'

const STORAGE_KEY = 'pedispectra-theme'

interface ThemeContextValue {
  activeTheme: ThemeConfig
  setThemeById: (id: string) => void
  registry: ThemeConfig[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyThemeClass(cssClass: string) {
  const html = document.documentElement
  // Remove all theme classes
  THEME_REGISTRY.forEach((t) => {
    if (t.cssClass) html.classList.remove(t.cssClass)
  })
  // Apply new one
  if (cssClass) html.classList.add(cssClass)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(() => {
    // SSR-safe default
    return getThemeById(DEFAULT_THEME_ID)!
  })

  useEffect(() => {
    // Read stored preference on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const theme = stored ? getThemeById(stored) : undefined
      if (theme) {
        setActiveTheme(theme)
        applyThemeClass(theme.cssClass)
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, [])

  const setThemeById = (id: string) => {
    const theme = getThemeById(id)
    if (!theme) return
    setActiveTheme(theme)
    applyThemeClass(theme.cssClass)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // silent fail
    }
  }

  return (
    <ThemeContext.Provider value={{ activeTheme, setThemeById, registry: THEME_REGISTRY }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
