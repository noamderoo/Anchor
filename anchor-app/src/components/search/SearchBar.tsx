import { useEffect, useRef } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'

export function SearchBar() {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const setSearchQuery = useFilterStore((s) => s.setSearchQuery)
  const toggleAdvanced = useFilterStore((s) => s.toggleAdvanced)
  const isAdvancedOpen = useFilterStore((s) => s.isAdvancedOpen)
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)
  const activeFilterCount = useFilterStore((s) => s.activeFilterCount)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: / to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs, textareas, or contentEditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtersActive = hasActiveFilters()
  const filterCount = activeFilterCount()

  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex items-center">
        <Search
          size={14}
          className="absolute left-2.5 text-neutral-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Zoeken... ( / )"
          className="w-48 pl-8 pr-8 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 border border-transparent rounded-lg text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:bg-white dark:focus:bg-neutral-700 focus:border-primary-300 dark:focus:border-primary-600 focus:outline-none transition-colors"
          aria-label="Zoek entries"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer"
            aria-label="Zoekopdracht wissen"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Advanced filters toggle */}
      <button
        onClick={toggleAdvanced}
        className={`
          relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
          ${isAdvancedOpen || filtersActive
            ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
            : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }
        `}
        aria-label="Geavanceerde filters"
        aria-expanded={isAdvancedOpen}
      >
        <SlidersHorizontal size={14} />
        {filterCount > 0 && (
          <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-primary-600 text-white rounded-full">
            {filterCount}
          </span>
        )}
      </button>
    </div>
  )
}
