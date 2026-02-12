import { useAppStore } from '@/store/useAppStore'
import { useEntryStore } from '@/store/useEntryStore'
import { Timeline } from '@/components/timeline/Timeline'
import { ListView } from '@/components/views/ListView'
import { GridView } from '@/components/views/GridView'
import { Dashboard } from '@/components/dashboard/Dashboard'
import type { Entry } from '@/types'

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

  const visibleEntries = entries.filter((e) => !e.archived)

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Left: View area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div key={currentView} className="animate-view-switch">
          {/* Timeline view */}
          {currentView === 'timeline' && (
            <Timeline
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* List view */}
          {currentView === 'list' && (
            <ListView
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* Grid view */}
          {currentView === 'grid' && (
            <GridView
              entries={visibleEntries}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={onLoadMore}
              isLoadingMore={isLoadingMore}
            />
          )}

          {/* Graph view placeholder */}
          {currentView === 'graph' && (
            <div className="max-w-3xl">
              <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
                <div className="text-center">
                  <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                    Graph view
                  </p>
                  <p className="text-neutral-300 text-xs mt-1">
                    Wordt gebouwd in fase 8
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Dashboard */}
      <Dashboard
        entries={visibleEntries}
        onOpenEntry={openModal}
        onNewEntry={openTypeSelector}
      />
    </main>
  )
}
