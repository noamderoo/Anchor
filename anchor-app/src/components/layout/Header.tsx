import {
  GitCommitVertical,
  List,
  LayoutGrid,
  Network,
  Plus,
  PanelRightOpen,
  PanelRightClose,
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

export function Header() {
  const { currentView, setCurrentView, sidebarOpen, toggleSidebar } = useAppStore()
  const openTypeSelector = useEntryStore((s) => s.openTypeSelector)

  return (
    <header className="h-[var(--header-height)] border-b border-neutral-200 bg-white flex items-center justify-between px-4 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
          Anchor
        </h1>
      </div>

      {/* Center: View toggle buttons */}
      <nav className="flex items-center gap-1" aria-label="Weergave opties">
        {viewOptions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setCurrentView(type)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors cursor-pointer
              ${currentView === type
                ? 'bg-primary-50 text-primary-700'
                : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'
              }
            `}
            aria-label={label}
            aria-pressed={currentView === type}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Right: New entry + sidebar toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={openTypeSelector}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          aria-label="Nieuwe entry"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nieuw</span>
        </button>

        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label={sidebarOpen ? 'Sidebar inklappen' : 'Sidebar uitklappen'}
        >
          {sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>
    </header>
  )
}
