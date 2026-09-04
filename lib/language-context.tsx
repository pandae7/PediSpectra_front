'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { LANGUAGE_REGISTRY, DEFAULT_LANGUAGE_ID, getLanguageById, type LanguageConfig } from './languages'

const STORAGE_KEY = 'pedispectra-language'

interface LanguageContextValue {
  activeLanguage: LanguageConfig
  setLanguageById: (id: string) => void
  registry: LanguageConfig[]
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [activeLanguage, setActiveLanguage] = useState<LanguageConfig>(() => {
    // SSR-safe default
    return getLanguageById(DEFAULT_LANGUAGE_ID)!
  })

  useEffect(() => {
    // Read stored preference on mount
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const language = stored ? getLanguageById(stored) : undefined
      if (language) {
        setActiveLanguage(language)
      }
    } catch {
      // localStorage unavailable — keep default
    }
  }, [])

  const setLanguageById = (id: string) => {
    const language = getLanguageById(id)
    if (!language) return
    // NOTE: no i18n system exists yet — this only updates the selector's own
    // stored/active state. It intentionally does not translate or change
    // any rendered page content.
    setActiveLanguage(language)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // silent fail
    }
  }

  return (
    <LanguageContext.Provider value={{ activeLanguage, setLanguageById, registry: LANGUAGE_REGISTRY }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
