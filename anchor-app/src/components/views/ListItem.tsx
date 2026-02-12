import { ENTRY_TYPE_CONFIGS } from '@/types'
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_COLORS } from '@/constants/entryTypes'
import { useTagStore } from '@/store/useTagStore'
import { TagBadge } from '@/components/tags/TagBadge'
import type { Entry } from '@/types'

const EMPTY_TAGS: never[] = []

interface ListItemProps {
  entry: Entry
  onClick: (entry: Entry) => void
}

export function ListItem({ entry, onClick }: ListItemProps) {
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
      className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-left transition-all cursor-pointer hover:bg-white hover:shadow-sm group"
    >
      {/* Type icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors.bg} transition-transform group-hover:scale-110`}
      >
        <Icon size={15} className={colors.text} />
      </div>

      {/* Title + content preview */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-neutral-900 truncate group-hover:text-primary-700 transition-colors">
          {entry.title || 'Zonder titel'}
        </h3>
        {entry.content && (
          <p className="text-xs text-neutral-400 truncate mt-0.5">
            {entry.content}
          </p>
        )}
      </div>

      {/* Tags */}
      {entryTags.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          {entryTags.slice(0, 2).map((tag) => (
            <TagBadge key={tag.id} tag={tag} size="sm" />
          ))}
          {entryTags.length > 2 && (
            <span className="text-[10px] text-neutral-400">+{entryTags.length - 2}</span>
          )}
        </div>
      )}

      {/* Status */}
      {entry.status && (
        <span className="hidden md:inline text-xs px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 font-medium shrink-0">
          {entry.status}
        </span>
      )}

      {/* Type label */}
      <span
        className="hidden lg:inline text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0"
        style={{
          backgroundColor: `var(--color-${config.color})15`,
          color: `var(--color-${config.color})`,
        }}
      >
        {config.label}
      </span>

      {/* Date */}
      <span className="text-xs text-neutral-400 shrink-0 w-16 text-right">
        {formatDate(entry.created_at)}
      </span>
    </button>
  )
}
