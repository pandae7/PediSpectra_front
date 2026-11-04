// Per-child accent colours. Fixed hues that stay readable on all three themes.
// Each child gets the colour at their position in the parent's list, so siblings
// always look different from each other.
export const CHILD_ACCENTS = ['#e0678a', '#4f8ef7', '#c98410', '#8b6fe0', '#e8704a', '#3bb0c9']

// Growth chart colour by sex: blue for boys, pink for girls. Other falls back to the theme primary.
export function getGrowthColor(sex: string | null | undefined): string {
  if (sex === 'Male') return '#2f7de1'
  if (sex === 'Female') return '#e0508a'
  return 'var(--primary)'
}

export function getChildAccent(children: { id: string }[], childId: string | null | undefined): string {
  const idx = children.findIndex((c) => c.id === childId)
  return CHILD_ACCENTS[(idx < 0 ? 0 : idx) % CHILD_ACCENTS.length]
}