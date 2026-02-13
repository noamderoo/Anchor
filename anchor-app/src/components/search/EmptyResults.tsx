import { SearchX } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'

/**
 * Friendly empty state when filters produce no results.
 */
export function EmptyResults() {
  const clearAll = useFilterStore((s) => s.clearAll)

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        <SearchX size={24} className="text-neutral-500 dark:text-neutral-400" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">
        Geen resultaten gevonden
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 max-w-xs">
        Probeer andere zoektermen of filters...
      </p>
      <button
        onClick={clearAll}
        className="px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors cursor-pointer"
      >
        Filters wissen
      </button>
    </div>
  )
}
