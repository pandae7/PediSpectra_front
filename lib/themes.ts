/**
 * Theme Registry — Strategy pattern for theme management.
 * To add a new theme: add an entry here + matching CSS class in globals.css.
 */

export interface ThemeConfig {
  id: string
  label: string
  emoji: string
  cssClass: string // class applied to <html>, empty string = :root default
  description: string
}

export const THEME_REGISTRY: ThemeConfig[] = [
  {
    id: 'dark-teal',
    label: 'Dark Teal',
    emoji: '🌙',
    cssClass: '', // default :root theme
    description: 'Deep dark backgrounds with vibrant teal accents',
  },
  {
    id: 'light-sage',
    label: 'Light Sage',
    emoji: '☀️',
    cssClass: 'light-sage',
    description: 'Clean white backgrounds with soft sage green accents',
  },
  {
    id: 'earthy-warm',
    label: 'Earthy Warm',
    emoji: '🌿',
    cssClass: 'earthy-warm',
    description: 'Warm beige tones with deep teal and terracotta accents',
  },
]

export const DEFAULT_THEME_ID = 'dark-teal'

export function getThemeById(id: string): ThemeConfig | undefined {
  return THEME_REGISTRY.find((t) => t.id === id)
}

export function getDefaultTheme(): ThemeConfig {
  return THEME_REGISTRY[0]
}
