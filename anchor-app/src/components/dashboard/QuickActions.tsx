import { Plus, Pencil, CalendarDays } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'
import type { Entry } from '@/types'

interface QuickActionsProps {
  latestEntry: Entry | null
  thisWeekCount: number
  onNewEntry: () => void
  onOpenEntry: (entry: Entry) => void
}

export function QuickActions({ latestEntry, thisWeekCount, onNewEntry, onOpenEntry }: QuickActionsProps) {
  const setDateRange = useFilterStore((s) => s.setDateRange)

  const handleReviewThisWeek = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    setDateRange({
      from: weekAgo.toISOString().split('T')[0],
      to: now.toISOString().split('T')[0],
    })
  }

  return (
    <section>
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
        Quick actions
      </h2>
      <div className="space-y-1.5">
        <button
          onClick={onNewEntry}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-white hover:text-neutral-800 border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all cursor-pointer"
        >
          <Plus size={15} className="text-primary-500" />
          Nieuwe entry
        </button>
        {latestEntry && (
          <button
            onClick={() => onOpenEntry(latestEntry)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-white hover:text-neutral-800 border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <Pencil size={15} className="text-neutral-400" />
            <span className="truncate">
              Verder met "{latestEntry.title || 'Zonder titel'}"
            </span>
          </button>
        )}
        {thisWeekCount > 0 && (
          <button
            onClick={handleReviewThisWeek}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-600 hover:bg-white hover:text-neutral-800 border border-transparent hover:border-neutral-200 hover:shadow-sm transition-all cursor-pointer"
          >
            <CalendarDays size={15} className="text-indigo-400" />
            <span className="truncate">
              Review deze week ({thisWeekCount})
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
