import {
  GitCommitVertical,
  List,
  LayoutGrid,
  Network,
  Plus,
  PanelRightOpen,
  PanelRightClose,
  Menu,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useEntryStore } from '@/store/useEntryStore'
import { SearchBar } from '@/components/search/SearchBar'
import type { ViewType } from '@/types'

const viewOptions: { type: ViewType; icon: typeof GitCommitVertical; label: string }[] = [
  { type: 'timeline', icon: GitCommitVertical, label: 'Tijdlijn' },
  { type: 'list', icon: List, label: 'Lijst' },
  { type: 'grid', icon: LayoutGrid, label: 'Grid' },
  { type: 'graph', icon: Network, label: 'Graph' },
]

export function Header() {
  const { currentView, setCurrentView, sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore()
  const openTypeSelector = useEntryStore((s) => s.openTypeSelector)

  return (
    <header className="h-[var(--header-height)] border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex items-center justify-between px-3 md:px-4 shrink-0">
      {/* Left: Logo + mobile menu */}
      <div className="flex items-center gap-2">
        {/* Mobile hamburger for sidebar */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="touch-target p-1.5 rounded-lg text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer md:hidden"
          aria-label="Menu openen"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          Anchor
        </h1>
      </div>

      {/* Center: View toggle buttons — hidden on mobile (MobileNav instead) */}
      <nav className="hidden md:flex items-center gap-1" aria-label="Weergave opties">
        {viewOptions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setCurrentView(type)}
            className={`
              touch-target flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-colors cursor-pointer
              ${currentView === type
                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }
            `}
            aria-label={label}
            aria-pressed={currentView === type}
          >
            <Icon size={16} />
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Search — hidden on small mobile, show from sm+ */}
      <div className="hidden sm:block">
        <SearchBar />
      </div>

      {/* Right: New entry + sidebar toggle */}
      <div className="flex items-center gap-2">
        {/* New entry — full button on desktop, icon only on mobile (MobileNav has FAB) */}
        <button
          onClick={openTypeSelector}
          className="hidden md:flex touch-target items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors cursor-pointer"
          aria-label="Nieuwe entry"
        >
          <Plus size={16} />
          <span className="hidden lg:inline">Nieuw</span>
        </button>

        {/* Sidebar toggle — only on desktop */}
        <button
          onClick={toggleSidebar}
          className="hidden md:flex touch-target p-1.5 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label={sidebarOpen ? 'Sidebar inklappen' : 'Sidebar uitklappen'}
        >
          {sidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
        </button>
      </div>
    </header>
  )
}
