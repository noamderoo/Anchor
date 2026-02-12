import { useEffect } from 'react'
import { useTagStore } from '@/store/useTagStore'

const EMPTY_TAGS: never[] = []

/**
 * Hook to load and access tags for a specific entry.
 * Auto-loads when entryId changes.
 */
export function useEntryTags(entryId: string | undefined) {
  const loadTagsForEntry = useTagStore((s) => s.loadTagsForEntry)
  const entryTags = useTagStore((s) =>
    entryId ? (s.entryTagsMap[entryId] ?? EMPTY_TAGS) : EMPTY_TAGS
  )

  useEffect(() => {
    if (entryId && entryId !== '') {
      loadTagsForEntry(entryId)
    }
  }, [entryId, loadTagsForEntry])

  return entryTags
}

/**
 * Hook to load and access all tags.
 * Auto-loads on mount.
 */
export function useTags() {
  const { tags, isLoading, loadTags } = useTagStore()

  useEffect(() => {
    if (tags.length === 0 && !isLoading) {
      loadTags()
    }
  }, [tags.length, isLoading, loadTags])

  return { tags, isLoading }
}
