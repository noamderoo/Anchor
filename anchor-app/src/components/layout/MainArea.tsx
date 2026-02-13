import { lazy, Suspense } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useEntryStore } from '@/store/useEntryStore'
import { useFilterStore } from '@/store/useFilterStore'
import { Timeline } from '@/components/timeline/Timeline'
import { ListView } from '@/components/views/ListView'
import { GridView } from '@/components/views/GridView'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { EmptyResults } from '@/components/search/EmptyResults'
import { TimelineSkeleton, ListSkeleton, GridSkeleton } from '@/components/ui/SkeletonLoader'
import type { Entry } from '@/types'

// Lazy load GraphView for code splitting
const GraphView = lazy(() =>
  import('@/components/graph/GraphView').then((m) => ({ default: m.GraphView }))
)

interface MainAreaProps {
  entries: Entry[]
  isLoading: boolean
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
}

export function MainArea({ entries, isLoading, hasMore, isLoadingMore, onLoadMore }: MainAreaProps) {
  const { currentView } = useAppStore()
  const { openModal, openTypeSelector } = useEntryStore()
  const hasActiveFilters = useFilterStore((s) => s.hasActiveFilters)

  const visibleEntries = entries.filter((e) => !e.archived)
  const showEmptyResults = !isLoading && visibleEntries.length === 0 && hasActiveFilters()

  // Determine skeleton for current view
  const renderSkeleton = () => {
    switch (currentView) {
      case 'list': return <ListSkeleton />
      case 'grid': return <GridSkeleton />
      default: return <TimelineSkeleton />
    }
  }

  return (
    <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
      {/* Left: View area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-[calc(var(--mobile-nav-height)+1rem)] md:pb-6">
        <div key={currentView} className="animate-view-switch">
          {/* Loading skeleton */}
          {isLoading && visibleEntries.length === 0 && renderSkeleton()}

          {/* Empty results from filters */}
          {showEmptyResults && <EmptyResults />}

          {/* Timeline view */}
          {currentView === 'timeline' && !showEmptyResults && !isLoading && (
            <Timeline
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* List view */}
          {currentView === 'list' && !showEmptyResults && !isLoading && (
            <ListView
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* Grid view */}
          {currentView === 'grid' && !showEmptyResults && !isLoading && (
            <GridView
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* Graph view — lazy loaded */}
          {currentView === 'graph' && !showEmptyResults && (
            <div className="h-full min-h-[500px]">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm">Graph laden...</p>
                  </div>
                </div>
              }>
                <GraphView entries={visibleEntries} />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Right: Dashboard — hidden on mobile, collapsible panel on tablet+ */}
      <Dashboard
        entries={visibleEntries}
        onOpenEntry={openModal}
        onNewEntry={openTypeSelector}
      />
    </main>
  )
}
