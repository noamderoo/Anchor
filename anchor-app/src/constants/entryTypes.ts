import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
} from 'lucide-react'
import type { EntryType } from '@/types'

/**
 * Icon components mapped to entry types.
 * Centralised so all components use the same mapping.
 */
export const ENTRY_TYPE_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

/**
 * Tailwind-compatible color classes per entry type.
 * These map to CSS custom properties defined in index.css.
 */
export const ENTRY_TYPE_COLORS: Record<EntryType, { bg: string; text: string; border: string }> = {
  lesson: {
    bg: 'bg-purple-50',
    text: 'text-purple-500',
    border: 'border-purple-400',
  },
  idea: {
    bg: 'bg-amber-50',
    text: 'text-amber-500',
    border: 'border-amber-400',
  },
  milestone: {
    bg: 'bg-green-50',
    text: 'text-green-500',
    border: 'border-green-400',
  },
  note: {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-400',
  },
  resource: {
    bg: 'bg-blue-50',
    text: 'text-blue-500',
    border: 'border-blue-400',
  },
  bookmark: {
    bg: 'bg-pink-50',
    text: 'text-pink-500',
    border: 'border-pink-400',
  },
}
