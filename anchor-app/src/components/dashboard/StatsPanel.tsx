import { TrendingUp, BookmarkCheck, FileText, Calendar } from 'lucide-react'
import type { Entry } from '@/types'

interface StatsPanelProps {
  entries: Entry[]
}

export function StatsPanel({ entries }: StatsPanelProps) {
  const now = new Date()

  const thisMonth = entries.filter((e) => {
    const d = new Date(e.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const thisWeek = entries.filter((e) => {
    const d = new Date(e.created_at)
    const diff = now.getTime() - d.getTime()
    return diff < 7 * 24 * 60 * 60 * 1000
  })

  const bookmarkCount = entries.filter((e) => e.entry_type === 'bookmark').length

  // Streak: consecutive days with entries (simplified)
  // TODO: Display streak in UI
  // const streak = calculateStreak(entries)

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
        Stats
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          icon={Calendar}
          value={thisMonth.length}
          label="Deze maand"
          color="text-primary-500"
          bgColor="bg-primary-50"
        />
        <StatCard
          icon={TrendingUp}
          value={thisWeek.length}
          label="Deze week"
          color="text-green-500"
          bgColor="bg-green-50"
        />
        <StatCard
          icon={BookmarkCheck}
          value={bookmarkCount}
          label="Bookmarks"
          color="text-pink-500"
          bgColor="bg-pink-50"
        />
        <StatCard
          icon={FileText}
          value={entries.length}
          label="Totaal"
          color="text-neutral-500"
          bgColor="bg-neutral-100"
        />
      </div>
    </section>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  color,
  bgColor,
}: {
  icon: typeof TrendingUp
  value: number
  label: string
  color: string
  bgColor: string
}) {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-6 h-6 rounded-md ${bgColor} flex items-center justify-center`}>
          <Icon size={12} className={color} />
        </div>
      </div>
      <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 leading-none">{value}</p>
      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{label}</p>
    </div>
  )
}

// TODO: Display streak in UI
/*
function calculateStreak(entries: Entry[]): number {
  if (entries.length === 0) return 0

  const days = new Set<string>()
  for (const entry of entries) {
    const d = new Date(entry.created_at)
    days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)
  }

  let streak = 0
  const now = new Date()
  const check = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Check if today has entries, if not check yesterday
  const todayKey = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`
  if (!days.has(todayKey)) {
    check.setDate(check.getDate() - 1)
    const yesterdayKey = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`
    if (!days.has(yesterdayKey)) return 0
  }

  while (true) {
    const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`
    if (days.has(key)) {
      streak++
      check.setDate(check.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
*/
