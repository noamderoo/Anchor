import { Plus, Pencil } from 'lucide-react'
import type { Entry } from '@/types'

interface QuickActionsProps {
  latestEntry: Entry | null
  onNewEntry: () => void
  onOpenEntry: (entry: Entry) => void
}

export function QuickActions({ latestEntry, onNewEntry, onOpenEntry }: QuickActionsProps) {
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
      </div>
    </section>
  )
}
