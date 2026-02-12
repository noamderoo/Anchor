import { useState, useRef, useMemo } from 'react'
import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
} from 'lucide-react'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import { useTagStore } from '@/store/useTagStore'
import { TagBadge } from '@/components/tags/TagBadge'
import type { Entry, EntryType } from '@/types'

const EMPTY_TAGS: never[] = []

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

interface TimelinePinProps {
  entry: Entry
  onClick: (entry: Entry) => void
}

export function TimelinePin({ entry, onClick }: TimelinePinProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const Icon = ENTRY_ICONS[entry.entry_type]
  const entryTags = useTagStore((s) => s.entryTagsMap[entry.id] ?? EMPTY_TAGS)

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => setShowTooltip(true), 200)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShowTooltip(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="relative group">
      <button
        onClick={() => onClick(entry)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full flex items-start gap-3 py-3 px-3 rounded-xl text-left transition-all cursor-pointer hover:bg-white hover:shadow-sm"
      >
        {/* Pin dot + connector */}
        <div className="relative flex flex-col items-center shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `var(--color-${config.color})15`, border: `1.5px solid var(--color-${config.color})40` }}
          >
            <Icon size={16} style={{ color: `var(--color-${config.color})` }} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <h3 className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
            {entry.title || 'Zonder titel'}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-neutral-400">{formatTime(entry.created_at)}</span>
            {entry.status && (
              <>
                <span className="text-neutral-300">·</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 font-medium">
                  {entry.status}
                </span>
              </>
            )}
          </div>
          {entryTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {entryTags.slice(0, 3).map((tag) => (
                <TagBadge key={tag.id} tag={tag} size="sm" />
              ))}
              {entryTags.length > 3 && (
                <span className="text-[10px] text-neutral-400 self-center">+{entryTags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Hover tooltip */}
      {showTooltip && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-30 pointer-events-none animate-fade-in">
          <div className="bg-neutral-800 text-white rounded-lg shadow-lg px-3 py-2.5 text-xs min-w-[200px] max-w-[280px]">
            {entry.content && (
              <p className="text-neutral-200 line-clamp-3 mb-2">{entry.content}</p>
            )}
            <div className="flex items-center gap-2 text-neutral-400">
              <span
                className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
                style={{ backgroundColor: `var(--color-${config.color})30`, color: `var(--color-${config.color})` }}
              >
                {config.label}
              </span>
              <span>{formatDate(entry.created_at)}</span>
            </div>
            {/* Arrow */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[5px] border-r-neutral-800" />
          </div>
        </div>
      )}
    </div>
  )
}
