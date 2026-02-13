import { RefreshCw, Sparkles } from 'lucide-react'
import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
} from 'lucide-react'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import type { Entry, EntryType } from '@/types'
import { useRandomHighlight } from '@/hooks/useReflections'

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

interface RandomHighlightProps {
  onOpenEntry: (entry: Entry) => void
}

export function RandomHighlight({ onOpenEntry }: RandomHighlightProps) {
  const { entry, isLoading, refresh } = useRandomHighlight()

  if (isLoading) {
    return (
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-400" />
          Herontdek dit...
        </h2>
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4 animate-pulse">
          <div className="h-4 bg-neutral-100 dark:bg-neutral-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-full mb-1" />
          <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-2/3" />
        </div>
      </section>
    )
  }

  if (!entry) {
    return null // Geen oude entries beschikbaar, toon niets
  }

  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const Icon = ENTRY_ICONS[entry.entry_type]

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    if (days < 7) return `${days} dagen geleden`
    const weeks = Math.floor(days / 7)
    if (weeks < 5) return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`
    const years = Math.floor(days / 365)
    return `${years} ${years === 1 ? 'jaar' : 'jaar'} geleden`
  }

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-400" />
          Herontdek dit...
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation()
            refresh()
          }}
          className="p-1 rounded-md text-neutral-300 hover:text-neutral-500 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          title="Ander item tonen"
        >
          <RefreshCw size={12} />
        </button>
      </div>
      <button
        onClick={() => onOpenEntry(entry)}
        className="w-full text-left rounded-xl border border-amber-100 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 p-4 hover:border-amber-200 dark:hover:border-amber-800 hover:shadow-sm transition-all cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `var(--color-${config.color})15` }}
          >
            <Icon size={14} style={{ color: `var(--color-${config.color})` }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              {entry.title || 'Zonder titel'}
            </h3>
            {entry.content && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">{entry.content}</p>
            )}
            <p className="text-[11px] text-amber-500/70 mt-1.5">{timeAgo(entry.created_at)}</p>
          </div>
        </div>
      </button>
    </section>
  )
}
