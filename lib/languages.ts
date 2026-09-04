/**
 * Language Registry — Strategy pattern for language selection (UI shell only).
 * To add a new language: add an entry here. No translation wiring yet —
 * this registry only powers the language selector's own displayed state.
 */

export interface LanguageConfig {
  id: string
  label: string
  nativeLabel: string
  flagEmoji?: string
}

export const LANGUAGE_REGISTRY: LanguageConfig[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { id: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { id: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { id: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { id: 'bn', label: 'Bangla', nativeLabel: 'বাংলা' },
]

export const DEFAULT_LANGUAGE_ID = 'en'

export function getLanguageById(id: string): LanguageConfig | undefined {
  return LANGUAGE_REGISTRY.find((l) => l.id === id)
}
