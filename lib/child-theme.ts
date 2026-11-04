// Per-child accent colours. Fixed hues that stay readable on all three themes.
// Each child gets the colour at their position in the parent's list, so siblings
// always look different from each other.
export const CHILD_ACCENTS = ['#e0678a', '#4f8ef7', '#c98410', '#8b6fe0', '#e8704a', '#3bb0c9']

export function getChildAccent(children: { id: string }[], childId: string | null | undefined): string {
  const idx = children.findIndex((c) => c.id === childId)
  return CHILD_ACCENTS[(idx < 0 ? 0 : idx) % CHILD_ACCENTS.length]
}