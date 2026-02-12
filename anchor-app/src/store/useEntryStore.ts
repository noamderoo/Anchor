import { create } from 'zustand'
import type { Entry, NewEntry, EntryUpdate } from '@/types'
import * as entriesApi from '@/lib/queries/entries'

const BATCH_SIZE = 50

interface EntryStore {
  // State
  entries: Entry[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: string | null

  // Modal state
  isModalOpen: boolean
  isTypeSelectorOpen: boolean
  editingEntry: Entry | null

  // Actions
  loadEntries: () => Promise<void>
  loadMore: () => Promise<void>
  createEntry: (entry: NewEntry) => Promise<Entry>
  updateEntry: (id: string, updates: EntryUpdate) => Promise<void>
  archiveEntry: (id: string) => Promise<void>
  deleteEntry: (id: string) => Promise<void>

  // Modal actions
  openTypeSelector: () => void
  closeTypeSelector: () => void
  openModal: (entry: Entry) => void
  openNewModal: (entryType: Entry['entry_type']) => void
  closeModal: () => void
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
  error: null,

  isModalOpen: false,
  isTypeSelectorOpen: false,
  editingEntry: null,

  loadEntries: async () => {
    set({ isLoading: true, error: null })
    try {
      const entries = await entriesApi.fetchEntries({ limit: BATCH_SIZE, offset: 0 })
      set({ entries, isLoading: false, hasMore: entries.length >= BATCH_SIZE })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  loadMore: async () => {
    const { isLoadingMore, hasMore, entries } = get()
    if (isLoadingMore || !hasMore) return

    set({ isLoadingMore: true })
    try {
      const data = await entriesApi.fetchEntries({ limit: BATCH_SIZE, offset: entries.length })
      // Deduplicate
      const existingIds = new Set(entries.map((e) => e.id))
      const newEntries = data.filter((e) => !existingIds.has(e.id))
      set((state) => ({
        entries: [...state.entries, ...newEntries],
        isLoadingMore: false,
        hasMore: data.length >= BATCH_SIZE,
      }))
    } catch (err) {
      set({ isLoadingMore: false, error: (err as Error).message })
    }
  },

  createEntry: async (entry) => {
    // Optimistic: add temp entry
    const tempId = `temp-${Date.now()}`
    const tempEntry: Entry = {
      ...entry,
      id: tempId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    set((state) => ({ entries: [tempEntry, ...state.entries] }))

    try {
      const created = await entriesApi.createEntry(entry)
      // Replace temp with real entry
      set((state) => ({
        entries: state.entries.map((e) => (e.id === tempId ? created : e)),
        editingEntry: state.editingEntry?.id === tempId ? created : state.editingEntry,
      }))
      return created
    } catch (err) {
      // Rollback
      set((state) => ({
        entries: state.entries.filter((e) => e.id !== tempId),
        error: (err as Error).message,
      }))
      throw err
    }
  },

  updateEntry: async (id, updates) => {
    // Optimistic update
    const previous = get().entries.find((e) => e.id === id)
    if (!previous) return

    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
      ),
      editingEntry:
        state.editingEntry?.id === id
          ? { ...state.editingEntry, ...updates, updated_at: new Date().toISOString() }
          : state.editingEntry,
    }))

    try {
      const updated = await entriesApi.updateEntry(id, updates)
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? updated : e)),
        editingEntry: state.editingEntry?.id === id ? updated : state.editingEntry,
      }))
    } catch (err) {
      // Rollback
      set((state) => ({
        entries: state.entries.map((e) => (e.id === id ? previous : e)),
        editingEntry: state.editingEntry?.id === id ? previous : state.editingEntry,
        error: (err as Error).message,
      }))
      throw err
    }
  },

  archiveEntry: async (id) => {
    // Optimistic: remove from list
    const previous = get().entries.find((e) => e.id === id)
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      isModalOpen: state.editingEntry?.id === id ? false : state.isModalOpen,
      editingEntry: state.editingEntry?.id === id ? null : state.editingEntry,
    }))

    try {
      await entriesApi.archiveEntry(id)
    } catch (err) {
      // Rollback
      if (previous) {
        set((state) => ({
          entries: [previous, ...state.entries],
          error: (err as Error).message,
        }))
      }
      throw err
    }
  },

  deleteEntry: async (id) => {
    // Optimistic: remove from list
    const previous = get().entries.find((e) => e.id === id)
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
      isModalOpen: state.editingEntry?.id === id ? false : state.isModalOpen,
      editingEntry: state.editingEntry?.id === id ? null : state.editingEntry,
    }))

    try {
      await entriesApi.deleteEntry(id)
    } catch (err) {
      // Rollback
      if (previous) {
        set((state) => ({
          entries: [previous, ...state.entries],
          error: (err as Error).message,
        }))
      }
      throw err
    }
  },

  openTypeSelector: () => set({ isTypeSelectorOpen: true }),
  closeTypeSelector: () => set({ isTypeSelectorOpen: false }),

  openModal: (entry) => set({ isModalOpen: true, editingEntry: entry, isTypeSelectorOpen: false }),

  openNewModal: (entryType) => {
    const newEntry: Entry = {
      id: '',
      title: '',
      content: null,
      entry_type: entryType,
      status: null,
      custom_date: null,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      archived: false,
    }
    set({ isModalOpen: true, editingEntry: newEntry, isTypeSelectorOpen: false })
  },

  closeModal: () => set({ isModalOpen: false, editingEntry: null }),
}))
