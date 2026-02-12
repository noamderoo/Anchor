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

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

interface LatestEntryProps {
  entry: Entry | null
  onOpen: (entry: Entry) => void
}

export function LatestEntry({ entry, onOpen }: LatestEntryProps) {
  if (!entry) {
    return (
      <section className="mb-6">
        <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
          Laatste entry
        </h2>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 h-20 flex items-center justify-center">
          <p className="text-neutral-300 text-sm">Nog geen entries</p>
        </div>
      </section>
    )
  }

  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const Icon = ENTRY_ICONS[entry.entry_type]

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
    })
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'Zojuist'
    if (minutes < 60) return `${minutes}m geleden`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}u geleden`
    const days = Math.floor(hours / 24)
    if (days === 1) return 'Gisteren'
    if (days < 7) return `${days}d geleden`
    return formatDate(dateStr)
  }

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
        Laatste entry
      </h2>
      <button
        onClick={() => onOpen(entry)}
        className="w-full text-left rounded-xl border border-neutral-200 bg-white p-4 hover:border-neutral-300 hover:shadow-sm transition-all cursor-pointer group"
        style={{ borderLeftWidth: '3px', borderLeftColor: `var(--color-${config.color})` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: `var(--color-${config.color})15` }}
          >
            <Icon size={14} style={{ color: `var(--color-${config.color})` }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
              {entry.title || 'Zonder titel'}
            </h3>
            {entry.content && (
              <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">{entry.content}</p>
            )}
            <p className="text-[11px] text-neutral-400 mt-1.5">{timeAgo(entry.updated_at)}</p>
          </div>
        </div>
      </button>
    </section>
  )
}
