import { useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { MainArea } from '@/components/layout/MainArea'
import { EntryModal } from '@/components/entry/EntryModal'
import { EntryTypeSelector } from '@/components/entry/EntryTypeSelector'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { AdvancedFilters } from '@/components/search/AdvancedFilters'
import { ActiveFilters } from '@/components/search/ActiveFilters'
import { useEntryStore } from '@/store/useEntryStore'
import { useTagStore } from '@/store/useTagStore'
import { useFilteredEntries } from '@/hooks/useFilters'

export default function App() {
  const loadEntries = useEntryStore((s) => s.loadEntries)
  const entries = useEntryStore((s) => s.entries)
  const isLoading = useEntryStore((s) => s.isLoading)
  const isLoadingMore = useEntryStore((s) => s.isLoadingMore)
  const hasMore = useEntryStore((s) => s.hasMore)
  const loadMore = useEntryStore((s) => s.loadMore)
  const loadTags = useTagStore((s) => s.loadTags)
  const loadTagsForEntries = useTagStore((s) => s.loadTagsForEntries)

  // Apply filters
  const filteredEntries = useFilteredEntries(entries)

  useEffect(() => {
    loadEntries()
    loadTags()
  }, [loadEntries, loadTags])

  // Load tags for visible entries
  useEffect(() => {
    if (entries.length > 0) {
      const entryIds = entries.map((e) => e.id).filter((id) => !id.startsWith('temp-'))
      if (entryIds.length > 0) {
        loadTagsForEntries(entryIds)
      }
    }
  }, [entries, loadTagsForEntries])

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <AdvancedFilters entries={entries} />
      <ActiveFilters />
      <div className="flex-1 flex overflow-hidden">
        <MainArea
          entries={filteredEntries}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={loadMore}
        />
        <Sidebar />
      </div>

      {/* Overlays */}
      <EntryTypeSelector />
      <EntryModal />
      <ToastContainer />
    </div>
  )
}
