import { LatestEntry } from '@/components/dashboard/LatestEntry'
import { StatsPanel } from '@/components/dashboard/StatsPanel'
import { QuickActions } from '@/components/dashboard/QuickActions'
import type { Entry } from '@/types'

interface DashboardProps {
  entries: Entry[]
  onOpenEntry: (entry: Entry) => void
  onNewEntry: () => void
}

export function Dashboard({ entries, onOpenEntry, onNewEntry }: DashboardProps) {
  const latestEntry = entries.length > 0 ? entries[0] : null

  return (
    <div className="w-80 border-l border-neutral-200 bg-neutral-50/50 overflow-y-auto p-6 hidden lg:block">
      <LatestEntry entry={latestEntry} onOpen={onOpenEntry} />
      <StatsPanel entries={entries} />
      <QuickActions
        latestEntry={latestEntry}
        onNewEntry={onNewEntry}
        onOpenEntry={onOpenEntry}
      />
    </div>
  )
}
