import { ENTRY_TYPE_CONFIGS } from '@/types'
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_COLORS } from '@/constants/entryTypes'
import { useTagStore } from '@/store/useTagStore'
import { TagBadge } from '@/components/tags/TagBadge'
import type { Entry } from '@/types'

const EMPTY_TAGS: never[] = []

interface GridCardProps {
  entry: Entry
  onClick: (entry: Entry) => void
}

export function GridCard({ entry, onClick }: GridCardProps) {
  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const Icon = ENTRY_TYPE_ICONS[entry.entry_type]
  const colors = ENTRY_TYPE_COLORS[entry.entry_type]
  const entryTags = useTagStore((s) => s.entryTagsMap[entry.id] ?? EMPTY_TAGS)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    }

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Gisteren'
    }

    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
    }

    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <button
      onClick={() => onClick(entry)}
      className="relative w-full text-left rounded-xl bg-white border border-neutral-200 p-4 transition-all cursor-pointer hover:shadow-md hover:border-neutral-300 hover:-translate-y-0.5 group flex flex-col overflow-hidden"
    >
      {/* Header: type icon + type label + date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg} transition-transform group-hover:scale-110`}
          >
            <Icon size={15} className={colors.text} />
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: `var(--color-${config.color})15`,
              color: `var(--color-${config.color})`,
            }}
          >
            {config.label}
          </span>
        </div>
        <span className="text-xs text-neutral-400">
          {formatDate(entry.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-2 group-hover:text-primary-700 transition-colors">
        {entry.title || 'Zonder titel'}
      </h3>

      {/* Content preview */}
      {entry.content && (
        <p className="text-xs text-neutral-400 line-clamp-3 mb-3 flex-1">
          {entry.content}
        </p>
      )}
      {!entry.content && <div className="flex-1" />}

      {/* Footer: tags + status */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
        {/* Tags */}
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {entryTags.slice(0, 2).map((tag) => (
            <TagBadge key={tag.id} tag={tag} size="sm" />
          ))}
          {entryTags.length > 2 && (
            <span className="text-[10px] text-neutral-400 shrink-0">+{entryTags.length - 2}</span>
          )}
        </div>

        {/* Status */}
        {entry.status && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 font-medium shrink-0 ml-2">
            {entry.status}
          </span>
        )}
      </div>

      {/* Colored accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ backgroundColor: `var(--color-${config.color})` }}
      />
    </button>
  )
}
