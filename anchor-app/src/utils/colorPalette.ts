// ─── Tag Color Palette ───
// Diverse hues, consistent saturation/lightness, accessible contrast on white

const TAG_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#0ea5e9', // Sky
  '#3b82f6', // Blue
  '#6d28d9', // Deep Violet
  '#be185d', // Deep Pink
  '#0d9488', // Deep Teal
] as const

/**
 * Pick the next color from the palette based on how many tags already exist.
 * Cycles through the palette if there are more tags than colors.
 */
export function getNextTagColor(existingCount: number): string {
  return TAG_COLORS[existingCount % TAG_COLORS.length]
}

/**
 * Get all available tag colors for a color picker.
 */
export function getTagColors(): readonly string[] {
  return TAG_COLORS
}

/**
 * Generate a lighter variant of a hex color for backgrounds.
 * Returns the color with opacity — use as CSS variable or with opacity utilities.
 */
export function getTagBgColor(hex: string): string {
  return `${hex}18`
}

/**
 * Get a slightly more opaque variant for borders.
 */
export function getTagBorderColor(hex: string): string {
  return `${hex}30`
}
