import { create } from 'zustand'
import type { ViewType } from '@/types'

interface AppStore {
  // State
  currentView: ViewType
  sidebarOpen: boolean
  selectedEntryId: string | null

  // Actions
  setCurrentView: (view: ViewType) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSelectedEntryId: (id: string | null) => void
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

// ─── Store ───

export const useAppStore = create<AppStore>((set) => ({
  currentView: getViewFromURL(),
  sidebarOpen: true,
  selectedEntryId: getEntryIdFromURL(),

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
}))
