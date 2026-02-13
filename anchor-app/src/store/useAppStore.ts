import { create } from 'zustand'
import type { ViewType } from '@/types'

export type Theme = 'light' | 'dark' | 'system'

interface AppStore {
  // State
  currentView: ViewType
  sidebarOpen: boolean
  selectedEntryId: string | null
  theme: Theme
  resolvedTheme: 'light' | 'dark'

  // Actions
  setCurrentView: (view: ViewType) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSelectedEntryId: (id: string | null) => void
  setTheme: (theme: Theme) => void
}

// ─── URL Param Helpers ───

function getViewFromURL(): ViewType {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view')
  const validViews: ViewType[] = ['timeline', 'list', 'grid', 'graph']
  if (view && validViews.includes(view as ViewType)) {
    return view as ViewType
  }
  return 'timeline'
}

function getEntryIdFromURL(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('entry') || null
}

function updateURLParams(updates: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search)

  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === undefined) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  }

  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname

  window.history.replaceState({}, '', newURL)
}

// ─── Theme Helpers ───

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('anchor-theme')
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

// ─── Store ───

const initialTheme = getStoredTheme()
const initialResolved = resolveTheme(initialTheme)
applyTheme(initialResolved)

export const useAppStore = create<AppStore>((set) => ({
  currentView: getViewFromURL(),
  sidebarOpen: true,
  selectedEntryId: getEntryIdFromURL(),
  theme: initialTheme,
  resolvedTheme: initialResolved,

  setCurrentView: (view) => {
    updateURLParams({ view: view === 'timeline' ? null : view })
    set({ currentView: view })
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setSelectedEntryId: (id) => {
    updateURLParams({ entry: id })
    set({ selectedEntryId: id })
  },

  setTheme: (theme) => {
    localStorage.setItem('anchor-theme', theme)
    const resolved = resolveTheme(theme)
    applyTheme(resolved)
    set({ theme, resolvedTheme: resolved })
  },
}))

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const state = useAppStore.getState()
  if (state.theme === 'system') {
    const resolved = getSystemTheme()
    applyTheme(resolved)
    useAppStore.setState({ resolvedTheme: resolved })
  }
})
