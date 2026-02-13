import {
  Home,
  Settings,
  Archive,
  Bookmark,
  Tag,
  Sun,
  Moon,
  Monitor,
  X,
} from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { Theme } from '@/store/useAppStore'

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: Bookmark, label: 'Bookmarks', id: 'bookmarks' },
  { icon: Tag, label: 'Tags', id: 'tags' },
  { icon: Archive, label: 'Archief', id: 'archive' },
]

const bottomItems = [
  { icon: Settings, label: 'Instellingen', id: 'settings' },
]

const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Licht' },
  { value: 'dark', icon: Moon, label: 'Donker' },
  { value: 'system', icon: Monitor, label: 'Systeem' },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, theme, setTheme } = useAppStore()

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          border-l border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900
          flex flex-col shrink-0 transition-all duration-200 ease-in-out overflow-hidden

          /* Mobile: slide-in overlay from right */
          fixed md:relative top-0 right-0 h-full z-50
          ${sidebarOpen
            ? 'w-[var(--sidebar-width)] translate-x-0'
            : 'w-[var(--sidebar-collapsed-width)] translate-x-full md:translate-x-0'
          }
        `}
        aria-label="Sidebar navigatie"
        role="complementary"
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-3 py-3 md:hidden">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Menu</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="touch-target p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Menu sluiten"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navItems.map(({ icon: Icon, label, id }) => (
              <li key={id}>
                <button
                  className={`
                    touch-target flex items-center gap-3 w-full rounded-lg text-sm font-medium
                    text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100
                    hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer
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

        {/* Theme toggle */}
        {sidebarOpen && (
          <div className="px-3 pb-2">
            <div className="flex items-center rounded-lg bg-neutral-100 dark:bg-neutral-800 p-1">
              {themeOptions.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-medium
                    transition-colors cursor-pointer
                    ${theme === value
                      ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm'
                      : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                    }
                  `}
                  aria-label={`Thema: ${label}`}
                  aria-pressed={theme === value}
                  title={label}
                >
                  <Icon size={14} />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom section */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 py-4">
          <ul className="space-y-1 px-2">
            {bottomItems.map(({ icon: Icon, label, id }) => (
              <li key={id}>
                <button
                  className={`
                    touch-target flex items-center gap-3 w-full rounded-lg text-sm font-medium
                    text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200
                    hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer
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
    </>
  )
}
