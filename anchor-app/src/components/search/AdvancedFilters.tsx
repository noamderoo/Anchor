import { X, Calendar, Tag as TagIcon, FileText, Activity } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'
import { useTagStore } from '@/store/useTagStore'
import { ENTRY_TYPE_ICONS, ENTRY_TYPE_COLORS } from '@/constants/entryTypes'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import type { EntryType, Entry } from '@/types'
import { getTagBgColor, getTagBorderColor } from '@/utils/colorPalette'

interface AdvancedFiltersProps {
  entries: Entry[]
}

export function AdvancedFilters({ entries }: AdvancedFiltersProps) {
  const isAdvancedOpen = useFilterStore((s) => s.isAdvancedOpen)
  const selectedTags = useFilterStore((s) => s.selectedTags)
  const selectedTypes = useFilterStore((s) => s.selectedTypes)
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses)
  const dateRange = useFilterStore((s) => s.dateRange)
  const toggleTag = useFilterStore((s) => s.toggleTag)
  const toggleType = useFilterStore((s) => s.toggleType)
  const toggleStatus = useFilterStore((s) => s.toggleStatus)
  const setDateRange = useFilterStore((s) => s.setDateRange)
  const clearAll = useFilterStore((s) => s.clearAll)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  const tags = useTagStore((s) => s.tags)

  if (!isAdvancedOpen) return null

  // Collect unique statuses from entries
  const uniqueStatuses = Array.from(
    new Set(entries.map((e) => e.status).filter((s): s is string => !!s && s.trim() !== ''))
  ).sort()

  const entryTypes: EntryType[] = ['lesson', 'idea', 'milestone', 'note', 'resource', 'bookmark']

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 animate-slide-in-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Filters
        </h3>
        {hasActiveFilters() && (
          <button
            onClick={clearAll}
            className="text-xs text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
          >
            Alles wissen
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Entry types */}
        <div className="min-w-[140px]">
          <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <FileText size={12} />
            Type
          </label>
          <div className="flex flex-wrap gap-1.5">
            {entryTypes.map((type) => {
              const Icon = ENTRY_TYPE_ICONS[type]
              const colors = ENTRY_TYPE_COLORS[type]
              const config = ENTRY_TYPE_CONFIGS[type]
              const isSelected = selectedTypes.includes(type)

              return (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer
                    ${isSelected
                      ? `${colors.bg} ${colors.text} ring-1 ring-current`
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }
                  `}
                  aria-pressed={isSelected}
                >
                  <Icon size={12} />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="min-w-[140px]">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              <TagIcon size={12} />
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag.id)
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer
                      ${isSelected
                        ? 'ring-1 ring-current'
                        : 'opacity-70 hover:opacity-100'
                      }
                    `}
                    style={{
                      backgroundColor: getTagBgColor(tag.color),
                      borderColor: getTagBorderColor(tag.color),
                      color: tag.color,
                    }}
                    aria-pressed={isSelected}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    {tag.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Status */}
        {uniqueStatuses.length > 0 && (
          <div className="min-w-[100px]">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
              <Activity size={12} />
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {uniqueStatuses.map((status) => {
                const isSelected = selectedStatuses.includes(status)
                return (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`
                      px-2 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer
                      ${isSelected
                        ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400 ring-1 ring-primary-300 dark:ring-primary-700'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }
                    `}
                    aria-pressed={isSelected}
                  >
                    {status}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Date range */}
        <div className="min-w-[200px]">
          <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2">
            <Calendar size={12} />
            Periode
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from || ''}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value || null })
              }
              className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-md text-neutral-700 dark:text-neutral-200 focus:bg-white dark:focus:bg-neutral-700 focus:border-primary-300 dark:focus:border-primary-600 focus:outline-none"
              aria-label="Startdatum"
            />
            <span className="text-xs text-neutral-500 dark:text-neutral-400">–</span>
            <input
              type="date"
              value={dateRange.to || ''}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value || null })
              }
              className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-md text-neutral-700 dark:text-neutral-200 focus:bg-white dark:focus:bg-neutral-700 focus:border-primary-300 dark:focus:border-primary-600 focus:outline-none"
              aria-label="Einddatum"
            />
            {(dateRange.from || dateRange.to) && (
              <button
                onClick={() => setDateRange({ from: null, to: null })}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                aria-label="Datumfilter wissen"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
