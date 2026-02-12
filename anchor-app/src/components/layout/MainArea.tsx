import { useAppStore } from '@/store/useAppStore'
import { useEntryStore } from '@/store/useEntryStore'
import { Timeline } from '@/components/timeline/Timeline'
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

        {/* Placeholder for future views */}
        {currentView !== 'timeline' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/50">
              <div className="text-center">
                <p className="text-neutral-400 text-sm font-medium uppercase tracking-wide">
                  {currentView} view
                </p>
                <p className="text-neutral-300 text-xs mt-1">
                  Wordt gebouwd in fase {currentView === 'list' || currentView === 'grid' ? '5' : '8'}
                </p>
              </div>
            </div>
          </div>
        )}
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
