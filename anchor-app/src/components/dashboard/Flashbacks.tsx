import { Clock, ChevronRight } from 'lucide-react'
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
import { useFlashbacks } from '@/hooks/useReflections'

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

interface FlashbacksProps {
  onOpenEntry: (entry: Entry) => void
}

function formatMonthsAgo(monthsAgo: number): string {
  if (monthsAgo === 1) return '1 maand geleden'
  return `${monthsAgo} maanden geleden`
}

export function Flashbacks({ onOpenEntry }: FlashbacksProps) {
  const { flashbacks, isLoading } = useFlashbacks()

  if (isLoading) {
    return (
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock size={12} className="text-indigo-400" />
          Terugblik
        </h2>
        <div className="space-y-2">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 animate-pulse">
            <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-1/3 mb-2" />
            <div className="h-3 bg-neutral-100 dark:bg-neutral-700 rounded w-2/3" />
          </div>
        </div>
      </section>
    )
  }

  if (flashbacks.length === 0) {
    return null // Geen flashbacks beschikbaar, toon niets
  }

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Clock size={12} className="text-indigo-400" />
        Terugblik
      </h2>
      <div className="space-y-2">
        {flashbacks.map(({ monthsAgo, entries }) => (
          <FlashbackGroup
            key={monthsAgo}
            monthsAgo={monthsAgo}
            entries={entries}
            onOpenEntry={onOpenEntry}
          />
        ))}
      </div>
    </section>
  )
}

function FlashbackGroup({
  monthsAgo,
  entries,
  onOpenEntry,
}: {
  monthsAgo: number
  entries: Entry[]
  onOpenEntry: (entry: Entry) => void
}) {
  // Toon maximaal 2 entries per maandstap
  const visibleEntries = entries.slice(0, 2)
  const remaining = entries.length - visibleEntries.length

  return (
    <div className="rounded-xl border border-indigo-50 dark:border-indigo-900/50 bg-indigo-50/20 dark:bg-indigo-950/20 p-3">
      <p className="text-[11px] font-medium text-indigo-400 mb-2">
        {formatMonthsAgo(monthsAgo)}
      </p>
      <div className="space-y-1.5">
        {visibleEntries.map((entry) => {
          const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
          const Icon = ENTRY_ICONS[entry.entry_type]

          return (
            <button
              key={entry.id}
              onClick={() => onOpenEntry(entry)}
              className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-neutral-700/40 transition-colors cursor-pointer group"
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ backgroundColor: `var(--color-${config.color})15` }}
              >
                <Icon size={10} style={{ color: `var(--color-${config.color})` }} />
              </div>
              <span className="text-xs text-neutral-700 dark:text-neutral-300 truncate flex-1 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {entry.title || 'Zonder titel'}
              </span>
              <ChevronRight size={10} className="text-neutral-300 group-hover:text-indigo-400 transition-colors shrink-0" />
            </button>
          )
        })}
        {remaining > 0 && (
          <p className="text-[10px] text-neutral-500 pl-9">
            +{remaining} meer
          </p>
        )}
      </div>
    </div>
  )
}
