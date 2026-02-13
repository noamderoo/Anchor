import { useFilterStore } from '@/store/useFilterStore'
import { useTagStore } from '@/store/useTagStore'
import { FilterTag } from '@/components/search/FilterTag'
import { ENTRY_TYPE_CONFIGS } from '@/types'

/**
 * Horizontal bar showing all active filter pills with remove buttons.
 * Rendered below the header/advanced filters when filters are active.
 */
export function ActiveFilters() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const selectedTags = useFilterStore((s) => s.selectedTags)
  const selectedTypes = useFilterStore((s) => s.selectedTypes)
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses)
  const dateRange = useFilterStore((s) => s.dateRange)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const toggleType = useFilterStore((s) => s.toggleType)
  const toggleStatus = useFilterStore((s) => s.toggleStatus)
  const setDateRange = useFilterStore((s) => s.setDateRange)
  const clearAll = useFilterStore((s) => s.clearAll)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  const tags = useTagStore((s) => s.tags)

  if (!hasActiveFilters()) return null

  const tagMap = new Map(tags.map((t) => [t.id, t]))

  return (
    <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mr-1">
        Actief:
      </span>

      {searchQuery.trim() && (
        <FilterTag
          label={`"${searchQuery.trim()}"`}
          onRemove={() => setSearchQuery('')}
        />
      )}

      {selectedTypes.map((type) => (
        <FilterTag
          key={type}
          label={ENTRY_TYPE_CONFIGS[type].label}
          onRemove={() => toggleType(type)}
        />
      ))}

      {selectedTags.map((tagId) => {
        const tag = tagMap.get(tagId)
        if (!tag) return null
        return (
          <FilterTag
            key={tagId}
            label={tag.name}
            color={tag.color}
            onRemove={() => toggleTag(tagId)}
          />
        )
      })}

      {selectedStatuses.map((status) => (
        <FilterTag
          key={status}
          label={status}
          onRemove={() => toggleStatus(status)}
        />
      ))}

      {(dateRange.from || dateRange.to) && (
        <FilterTag
          label={`${dateRange.from || '...'} – ${dateRange.to || '...'}`}
          onRemove={() => setDateRange({ from: null, to: null })}
        />
      )}

      <button
        onClick={clearAll}
        className="text-[10px] text-neutral-400 hover:text-neutral-600 font-medium ml-1 cursor-pointer"
      >
        Alles wissen
      </button>
    </div>
  )
}
