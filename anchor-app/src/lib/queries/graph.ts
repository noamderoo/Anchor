import type { Entry, EntryReference, Tag } from '@/types'

// ─── Graph Types ───

export interface GraphNode {
  id: string
  title: string
  entryType: Entry['entry_type']
  connectionCount: number
  entry: Entry
  // d3-force positions (set by simulation)
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

export interface GraphEdge {
  source: string
  target: string
  type: 'reference' | 'tag'
  weight: number // dikte: 1 voor reference, N voor aantal gedeelde tags
  label?: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

// ─── Build Graph Data ───

/**
 * Bouw graph data op uit entries, tags en references.
 * - Nodes = entries
 * - Edges = gedeelde tags (dikte = aantal gedeelde tags) + handmatige references
 * - maxNodes limiteert het aantal nodes (meest verbonden eerst)
 */
export function buildGraphData(
  entries: Entry[],
  entryTagsMap: Record<string, Tag[]>,
  references: EntryReference[],
  maxNodes = 200
): GraphData {
  // Filter archived entries
  const activeEntries = entries.filter((e) => !e.archived && !e.id.startsWith('temp-'))

  // Build edges from shared tags
  const tagEdges: GraphEdge[] = []
  const entryIds = activeEntries.map((e) => e.id)

  // For each pair of entries, count shared tags
  for (let i = 0; i < entryIds.length; i++) {
    const tagsA = entryTagsMap[entryIds[i]] || []
    const tagIdsA = new Set(tagsA.map((t) => t.id))

    for (let j = i + 1; j < entryIds.length; j++) {
      const tagsB = entryTagsMap[entryIds[j]] || []
      const shared = tagsB.filter((t) => tagIdsA.has(t.id))

      if (shared.length > 0) {
        tagEdges.push({
          source: entryIds[i],
          target: entryIds[j],
          type: 'tag',
          weight: shared.length,
          label: shared.map((t) => t.name).join(', '),
        })
      }
    }
  }

  // Build edges from manual references
  const entryIdSet = new Set(entryIds)
  const referenceEdges: GraphEdge[] = references
    .filter((r) => entryIdSet.has(r.from_entry_id) && entryIdSet.has(r.to_entry_id))
    .map((r) => ({
      source: r.from_entry_id,
      target: r.to_entry_id,
      type: 'reference' as const,
      weight: 1,
    }))

  // Combine edges
  const allEdges = [...tagEdges, ...referenceEdges]

  // Count connections per entry
  const connectionCount = new Map<string, number>()
  for (const edge of allEdges) {
    connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1)
    connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1)
  }

  // Select top N entries by connection count (include all with connections, then fill up)
  const sortedEntries = [...activeEntries].sort((a, b) => {
    const countA = connectionCount.get(a.id) || 0
    const countB = connectionCount.get(b.id) || 0
    return countB - countA
  })

  const selectedEntries = sortedEntries.slice(0, maxNodes)
  const selectedIds = new Set(selectedEntries.map((e) => e.id))

  // Build nodes
  const nodes: GraphNode[] = selectedEntries.map((entry) => ({
    id: entry.id,
    title: entry.title || 'Zonder titel',
    entryType: entry.entry_type,
    connectionCount: connectionCount.get(entry.id) || 0,
    entry,
  }))

  // Filter edges to only selected nodes
  const edges = allEdges.filter(
    (e) => selectedIds.has(e.source) && selectedIds.has(e.target)
  )

  return { nodes, edges }
}
