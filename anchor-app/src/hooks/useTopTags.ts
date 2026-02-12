import { useMemo } from 'react'
import { useTagStore } from '@/store/useTagStore'
import type { Tag } from '@/types'

export interface TagUsage {
  tag: Tag
  count: number
}

/**
 * Bereken de top N meest gebruikte tags op basis van de entryTagsMap.
 */
export function useTopTags(limit = 5): TagUsage[] {
  const entryTagsMap = useTagStore((s) => s.entryTagsMap)
  const tags = useTagStore((s) => s.tags)

  return useMemo(() => {
    // Tel het aantal entries per tag
    const countMap = new Map<string, number>()

    for (const entryTags of Object.values(entryTagsMap)) {
      for (const tag of entryTags) {
        countMap.set(tag.id, (countMap.get(tag.id) || 0) + 1)
      }
    }

    // Map naar TagUsage objecten, zoek de volledige tag data op
    const usages: TagUsage[] = []

    for (const [tagId, count] of countMap) {
      const tag = tags.find((t) => t.id === tagId)
      if (tag) {
        usages.push({ tag, count })
      }
    }

    // Sorteer op count (desc) en neem top N
    usages.sort((a, b) => b.count - a.count)

    return usages.slice(0, limit)
  }, [entryTagsMap, tags, limit])
}
