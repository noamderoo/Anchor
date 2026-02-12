import { useMemo } from 'react'
import type { Entry, Tag } from '@/types'
import { useFilterStore } from '@/store/useFilterStore'
import { useTagStore } from '@/store/useTagStore'
import { useSearch } from '@/hooks/useSearch'

/**
 * Hook that applies all active filters to an entries array.
 * Returns only the entries matching all filter criteria (AND logic).
 */
export function useFilteredEntries(entries: Entry[]): Entry[] {
  const searchQuery = useFilterStore((s) => s.searchQuery)
  const selectedTags = useFilterStore((s) => s.selectedTags)
  const selectedTypes = useFilterStore((s) => s.selectedTypes)
  const selectedStatuses = useFilterStore((s) => s.selectedStatuses)
  const dateRange = useFilterStore((s) => s.dateRange)
  const entryTagsMap = useTagStore((s) => s.entryTagsMap)

  // Debounce the search query
  const debouncedQuery = useSearch(searchQuery, 300)

  return useMemo(() => {
    let filtered = entries

    // ── Text search ──
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim()
      filtered = filtered.filter((entry) => {
        // Search in title
        if (entry.title?.toLowerCase().includes(q)) return true
        // Search in content
        if (entry.content?.toLowerCase().includes(q)) return true
        // Search in status
        if (entry.status?.toLowerCase().includes(q)) return true
        // Search in entry type
        if (entry.entry_type.toLowerCase().includes(q)) return true
        // Search in tags
        const tags: Tag[] = entryTagsMap[entry.id] || []
        if (tags.some((tag) => tag.name.toLowerCase().includes(q))) return true
        return false
      })
    }

    // ── Filter by tags (AND: entry must have ALL selected tags) ──
    if (selectedTags.length > 0) {
      filtered = filtered.filter((entry) => {
        const entryTags = entryTagsMap[entry.id] || []
        const entryTagIds = new Set(entryTags.map((t) => t.id))
        return selectedTags.every((tagId) => entryTagIds.has(tagId))
      })
    }

    // ── Filter by entry type ──
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((entry) =>
        selectedTypes.includes(entry.entry_type)
      )
    }

    // ── Filter by status ──
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((entry) => {
        if (!entry.status) return false
        return selectedStatuses.includes(entry.status)
      })
    }

    // ── Filter by date range ──
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.created_at)
        if (dateRange.from) {
          const from = new Date(dateRange.from)
          from.setHours(0, 0, 0, 0)
          if (entryDate < from) return false
        }
        if (dateRange.to) {
          const to = new Date(dateRange.to)
          to.setHours(23, 59, 59, 999)
          if (entryDate > to) return false
        }
        return true
      })
    }

    return filtered
  }, [entries, debouncedQuery, selectedTags, selectedTypes, selectedStatuses, dateRange, entryTagsMap])
}
