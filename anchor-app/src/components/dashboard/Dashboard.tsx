import { LatestEntry } from '@/components/dashboard/LatestEntry'
import { StatsPanel } from '@/components/dashboard/StatsPanel'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RandomHighlight } from '@/components/dashboard/RandomHighlight'
import { Flashbacks } from '@/components/dashboard/Flashbacks'
import { TopTags } from '@/components/dashboard/TopTags'
import type { Entry } from '@/types'

interface DashboardProps {
  entries: Entry[]
  onOpenEntry: (entry: Entry) => void
  onNewEntry: () => void
}

export function Dashboard({ entries, onOpenEntry, onNewEntry }: DashboardProps) {
  const latestEntry = entries.length > 0 ? entries[0] : null

  // Entries van deze week voor "Review deze week" quick action
  const thisWeekEntries = entries.filter((e) => {
    const diff = Date.now() - new Date(e.created_at).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  })

  return (
    <div className="w-80 border-l border-neutral-200 bg-neutral-50/50 overflow-y-auto p-6 hidden lg:block">
      <LatestEntry entry={latestEntry} onOpen={onOpenEntry} />
      <RandomHighlight onOpenEntry={onOpenEntry} />
      <StatsPanel entries={entries} />
      <TopTags />
      <Flashbacks onOpenEntry={onOpenEntry} />
      <QuickActions
        latestEntry={latestEntry}
        thisWeekCount={thisWeekEntries.length}
        onNewEntry={onNewEntry}
        onOpenEntry={onOpenEntry}
      />
    </div>
  )
}
