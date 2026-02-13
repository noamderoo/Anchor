import { useRef, useCallback, useEffect } from 'react'
import { Plus, Loader2, Anchor } from 'lucide-react'
import { GridCard } from '@/components/views/GridCard'
import { useEntryStore } from '@/store/useEntryStore'
import type { Entry } from '@/types'

interface GridViewProps {
  entries: Entry[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  isLoadingMore: boolean
}

export function GridView({ entries, isLoading, hasMore, onLoadMore, isLoadingMore }: GridViewProps) {
  const { openModal, openTypeSelector } = useEntryStore()
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Infinite scroll via IntersectionObserver
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
        onLoadMore()
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '200px',
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [observerCallback])

  const visibleEntries = entries.filter((e) => !e.archived)

  // Loading state
  if (isLoading && visibleEntries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-primary-500" />
      </div>
    )
  }

  // Empty state
  if (!isLoading && visibleEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center mb-4">
          <Anchor size={28} className="text-primary-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Nog geen entries</h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-5 text-center max-w-xs">
          Begin met je eerste entry — leg een les, idee, of gedachte vast.
        </p>
        <button
          onClick={openTypeSelector}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          Eerste entry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Responsive CSS Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleEntries.map((entry) => (
          <GridCard key={entry.id} entry={entry} onClick={openModal} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-px" />

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={18} className="animate-spin text-neutral-400" />
          <span className="ml-2 text-xs text-neutral-400">Meer laden...</span>
        </div>
      )}

      {/* End of grid */}
      {!hasMore && visibleEntries.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-300 dark:text-neutral-600 font-medium">Alles geladen</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>
      )}
    </div>
  )
}
