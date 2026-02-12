import {
  Home,
  Settings,
  Archive,
  Bookmark,
  Tag,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Bookmark, label: 'Bookmarks', id: 'bookmarks' },
  { icon: Tag, label: 'Tags', id: 'tags' },
  { icon: Archive, label: 'Archief', id: 'archive' },
]

const bottomItems = [
  { icon: Settings, label: 'Instellingen', id: 'settings' },
]

export function Sidebar() {
  const { sidebarOpen } = useAppStore()

  return (
    <aside
      className={`
        border-l border-neutral-200 bg-white flex flex-col shrink-0
        transition-all duration-200 ease-in-out overflow-hidden
        ${sidebarOpen ? 'w-[var(--sidebar-width)]' : 'w-[var(--sidebar-collapsed-width)]'}
      `}
      aria-label="Sidebar navigatie"
    >
      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ icon: Icon, label, id }) => (
            <li key={id}>
              <button
                className={`
                  flex items-center gap-3 w-full rounded-lg text-sm font-medium
                  text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100
                  transition-colors cursor-pointer
                  ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
                `}
                aria-label={label}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-neutral-200 py-4">
        <ul className="space-y-1 px-2">
          {bottomItems.map(({ icon: Icon, label, id }) => (
            <li key={id}>
              <button
                className={`
                  flex items-center gap-3 w-full rounded-lg text-sm font-medium
                  text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100
                  transition-colors cursor-pointer
                  ${sidebarOpen ? 'px-3 py-2' : 'px-0 py-2 justify-center'}
                `}
                aria-label={label}
                title={!sidebarOpen ? label : undefined}
              >
                <Icon size={18} className="shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
