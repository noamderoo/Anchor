import {
  GitCommitVertical,
  List,
  LayoutGrid,
  Network,
  Plus,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useEntryStore } from '@/store/useEntryStore'
import type { ViewType } from '@/types'

const viewOptions: { type: ViewType; icon: typeof GitCommitVertical; label: string }[] = [
  { type: 'timeline', icon: GitCommitVertical, label: 'Tijdlijn' },
  { type: 'list', icon: List, label: 'Lijst' },
  { type: 'grid', icon: LayoutGrid, label: 'Grid' },
  { type: 'graph', icon: Network, label: 'Graph' },
]

export function MobileNav() {
  const { currentView, setCurrentView } = useAppStore()
  const openTypeSelector = useEntryStore((s) => s.openTypeSelector)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 h-[var(--mobile-nav-height)] flex items-center justify-around px-2 md:hidden"
      aria-label="Mobiele navigatie"
    >
      {viewOptions.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => setCurrentView(type)}
          className={`
            touch-target flex flex-col items-center gap-0.5 rounded-lg text-xs font-medium
            transition-colors cursor-pointer px-2 py-1
            ${currentView === type
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-neutral-500 dark:text-neutral-400'
            }
          `}
          aria-label={label}
          aria-pressed={currentView === type}
        >
          <Icon size={20} />
          <span className="text-[10px]">{label}</span>
        </button>
      ))}

      {/* New entry FAB-style button */}
      <button
        onClick={openTypeSelector}
        className="touch-target flex flex-col items-center gap-0.5 text-white cursor-pointer"
        aria-label="Nieuwe entry"
      >
        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
          <Plus size={22} />
        </div>
      </button>
    </nav>
  )
}
