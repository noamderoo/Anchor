import { create } from 'zustand'
import type { Tag } from '@/types'
import * as tagsApi from '@/lib/queries/tags'
import { getNextTagColor } from '@/utils/colorPalette'

interface TagStore {
  // State
  tags: Tag[]
  isLoading: boolean
  error: string | null

  // Entry → tags mapping (cached)
  entryTagsMap: Record<string, Tag[]>

  // Actions
  loadTags: () => Promise<void>
  loadTagsForEntry: (entryId: string) => Promise<Tag[]>
  loadTagsForEntries: (entryIds: string[]) => Promise<void>
  createTag: (name: string) => Promise<Tag>
  updateTag: (id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>) => Promise<void>
  deleteTag: (id: string) => Promise<void>

  // Entry-tag linking
  addTagToEntry: (entryId: string, tagId: string) => Promise<void>
  removeTagFromEntry: (entryId: string, tagId: string) => Promise<void>
  createAndAddTag: (entryId: string, name: string) => Promise<Tag>

  // Helpers
  getTagsForEntry: (entryId: string) => Tag[]
}

export const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,
  entryTagsMap: {},

  loadTags: async () => {
    set({ isLoading: true, error: null })
    try {
      const tags = await tagsApi.fetchTags()
      set({ tags, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  loadTagsForEntry: async (entryId) => {
    try {
      const tags = await tagsApi.fetchTagsForEntry(entryId)
      set((state) => ({
        entryTagsMap: { ...state.entryTagsMap, [entryId]: tags },
      }))
      return tags
    } catch (err) {
      set({ error: (err as Error).message })
      return []
    }
  },

  loadTagsForEntries: async (entryIds) => {
    try {
      const map = await tagsApi.fetchTagsForEntries(entryIds)
      set((state) => ({
        entryTagsMap: { ...state.entryTagsMap, ...map },
      }))
    } catch (err) {
      set({ error: (err as Error).message })
    }
  },

  createTag: async (name) => {
    const { tags } = get()
    const color = getNextTagColor(tags.length)

    // Optimistic add
    const tempTag: Tag = {
      id: `temp-${Date.now()}`,
      name: name.trim().toLowerCase(),
      color,
      created_at: new Date().toISOString(),
    }
    set((state) => ({ tags: [...state.tags, tempTag] }))

    try {
      const created = await tagsApi.createTag(name, color)
      set((state) => ({
        tags: state.tags.map((t) => (t.id === tempTag.id ? created : t)),
      }))
      return created
    } catch (err) {
      // Rollback
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== tempTag.id),
        error: (err as Error).message,
      }))
      throw err
    }
  },

  updateTag: async (id, updates) => {
    const previous = get().tags.find((t) => t.id === id)
    if (!previous) return

    // Optimistic update
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      // Also update in entryTagsMap
      entryTagsMap: Object.fromEntries(
        Object.entries(state.entryTagsMap).map(([entryId, tags]) => [
          entryId,
          tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        ])
      ),
    }))

    try {
      await tagsApi.updateTag(id, updates)
    } catch (err) {
      // Rollback
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? previous : t)),
        error: (err as Error).message,
      }))
      throw err
    }
  },

  deleteTag: async (id) => {
    const previous = get().tags.find((t) => t.id === id)
    if (!previous) return

    // Optimistic remove
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      // Remove from all entry mappings
      entryTagsMap: Object.fromEntries(
        Object.entries(state.entryTagsMap).map(([entryId, tags]) => [
          entryId,
          tags.filter((t) => t.id !== id),
        ])
      ),
    }))

    try {
      await tagsApi.deleteTag(id)
    } catch (err) {
      // Rollback
      if (previous) {
        set((state) => ({
          tags: [...state.tags, previous],
          error: (err as Error).message,
        }))
      }
      throw err
    }
  },

  addTagToEntry: async (entryId, tagId) => {
    const tag = get().tags.find((t) => t.id === tagId)
    if (!tag) return

    // Optimistic add to entry
    set((state) => ({
      entryTagsMap: {
        ...state.entryTagsMap,
        [entryId]: [...(state.entryTagsMap[entryId] || []), tag],
      },
    }))

    try {
      await tagsApi.linkTagToEntry(entryId, tagId)
    } catch (err) {
      // Rollback
      set((state) => ({
        entryTagsMap: {
          ...state.entryTagsMap,
          [entryId]: (state.entryTagsMap[entryId] || []).filter((t) => t.id !== tagId),
        },
        error: (err as Error).message,
      }))
      throw err
    }
  },

  removeTagFromEntry: async (entryId, tagId) => {
    const previousTags = get().entryTagsMap[entryId] || []

    // Optimistic remove
    set((state) => ({
      entryTagsMap: {
        ...state.entryTagsMap,
        [entryId]: (state.entryTagsMap[entryId] || []).filter((t) => t.id !== tagId),
      },
    }))

    try {
      await tagsApi.unlinkTagFromEntry(entryId, tagId)
    } catch (err) {
      // Rollback
      set((state) => ({
        entryTagsMap: {
          ...state.entryTagsMap,
          [entryId]: previousTags,
        },
        error: (err as Error).message,
      }))
      throw err
    }
  },

  createAndAddTag: async (entryId, name) => {
    const tag = await get().createTag(name)
    await get().addTagToEntry(entryId, tag.id)
    return tag
  },

  getTagsForEntry: (entryId) => {
    return get().entryTagsMap[entryId] || []
  },
}))
