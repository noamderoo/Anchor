import { create } from 'zustand'
import type { EntryType } from '@/types'

export interface DateRange {
  from: string | null // ISO date string (yyyy-mm-dd)
  to: string | null
}

interface FilterStore {
  // State
  searchQuery: string
  selectedTags: string[] // tag IDs
  selectedTypes: EntryType[]
  selectedStatuses: string[]
  dateRange: DateRange
  isAdvancedOpen: boolean

  // Actions
  setSearchQuery: (query: string) => void
  toggleTag: (tagId: string) => void
  setSelectedTags: (tagIds: string[]) => void
  toggleType: (type: EntryType) => void
  setSelectedTypes: (types: EntryType[]) => void
  toggleStatus: (status: string) => void
  setSelectedStatuses: (statuses: string[]) => void
  setDateRange: (range: DateRange) => void
  setAdvancedOpen: (open: boolean) => void
  toggleAdvanced: () => void
  clearAll: () => void
  hasActiveFilters: () => boolean
  activeFilterCount: () => number
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  searchQuery: '',
  selectedTags: [],
  selectedTypes: [],
  selectedStatuses: [],
  dateRange: { from: null, to: null },
  isAdvancedOpen: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleTag: (tagId) =>
    set((state) => ({
      selectedTags: state.selectedTags.includes(tagId)
        ? state.selectedTags.filter((id) => id !== tagId)
        : [...state.selectedTags, tagId],
    })),

  setSelectedTags: (tagIds) => set({ selectedTags: tagIds }),

  toggleType: (type) =>
    set((state) => ({
      selectedTypes: state.selectedTypes.includes(type)
        ? state.selectedTypes.filter((t) => t !== type)
        : [...state.selectedTypes, type],
    })),

  setSelectedTypes: (types) => set({ selectedTypes: types }),

  toggleStatus: (status) =>
    set((state) => ({
      selectedStatuses: state.selectedStatuses.includes(status)
        ? state.selectedStatuses.filter((s) => s !== status)
        : [...state.selectedStatuses, status],
    })),

  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),

  setDateRange: (range) => set({ dateRange: range }),

  setAdvancedOpen: (open) => set({ isAdvancedOpen: open }),

  toggleAdvanced: () => set((state) => ({ isAdvancedOpen: !state.isAdvancedOpen })),

  clearAll: () =>
    set({
      searchQuery: '',
      selectedTags: [],
      selectedTypes: [],
      selectedStatuses: [],
      dateRange: { from: null, to: null },
    }),

  hasActiveFilters: () => {
    const s = get()
    return (
      s.searchQuery.trim() !== '' ||
      s.selectedTags.length > 0 ||
      s.selectedTypes.length > 0 ||
      s.selectedStatuses.length > 0 ||
      s.dateRange.from !== null ||
      s.dateRange.to !== null
    )
  },

  activeFilterCount: () => {
    const s = get()
    let count = 0
    if (s.searchQuery.trim() !== '') count++
    count += s.selectedTags.length
    count += s.selectedTypes.length
    count += s.selectedStatuses.length
    if (s.dateRange.from || s.dateRange.to) count++
    return count
  },
}))
