import { useRef, useCallback, useEffect } from 'react'
import { Plus, Loader2, Anchor } from 'lucide-react'
import { ListItem } from '@/components/views/ListItem'
import { useEntryStore } from '@/store/useEntryStore'
import type { Entry } from '@/types'

interface DateGroup {
  label: string
  entries: Entry[]
}

function groupEntriesByDate(entries: Entry[]): DateGroup[] {
  const groups: Map<string, Entry[]> = new Map()

  for (const entry of entries) {
    const date = new Date(entry.created_at)
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    let label: string

    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      label = 'Vandaag'
    } else if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      label = 'Gisteren'
    } else if (date.getFullYear() === now.getFullYear()) {
      label = date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
    } else {
      label = date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(entry)
  }

  return Array.from(groups.entries()).map(([label, entries]) => ({ label, entries }))
}

interface ListViewProps {
  entries: Entry[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
  isLoadingMore: boolean
}

export function ListView({ entries, isLoading, hasMore, onLoadMore, isLoadingMore }: ListViewProps) {
  const { openModal, openTypeSelector } = useEntryStore()
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
  const dateGroups = groupEntriesByDate(visibleEntries)

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
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5 text-center max-w-xs">
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
    <div ref={scrollRef} className="max-w-3xl">
      {dateGroups.map((group) => (
        <div key={group.label} className="mb-4 last:mb-0">
          {/* Date label */}
          <div className="flex items-center gap-3 mb-1 px-4">
            <h2 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {group.label}
            </h2>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          {/* Entries */}
          <div className="space-y-0.5">
            {group.entries.map((entry) => (
              <ListItem key={entry.id} entry={entry} onClick={openModal} />
            ))}
          </div>
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-px" />

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-6">
          <Loader2 size={18} className="animate-spin text-neutral-400" />
          <span className="ml-2 text-xs text-neutral-400">Meer laden...</span>
        </div>
      )}

      {/* End of list */}
      {!hasMore && visibleEntries.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Alles geladen</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>
      )}
    </div>
  )
}
