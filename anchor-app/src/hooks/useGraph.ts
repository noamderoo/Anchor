import { useEffect, useRef, useMemo, useCallback, useState } from 'react'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force'
import type { Entry, Tag, EntryReference } from '@/types'
import { buildGraphData, type GraphNode, type GraphEdge, type GraphData } from '@/lib/queries/graph'

// ─── Simulation Node/Link types ───

interface SimNode extends SimulationNodeDatum, GraphNode {}

interface SimLink extends SimulationLinkDatum<SimNode> {
  type: 'reference' | 'tag'
  weight: number
  label?: string
}

export interface UseGraphReturn {
  nodes: SimNode[]
  links: SimLink[]
  isSimulating: boolean
  graphData: GraphData
}

/**
 * Hook die graph data bouwt en d3-force simulatie draait.
 * Returnt gepositioneerde nodes en links.
 */
export function useGraph(
  entries: Entry[],
  entryTagsMap: Record<string, Tag[]>,
  references: EntryReference[],
  width: number,
  height: number
): UseGraphReturn {
  const [nodes, setNodes] = useState<SimNode[]>([])
  const [links, setLinks] = useState<SimLink[]>([])
  const [isSimulating, setIsSimulating] = useState(true)
  const simulationRef = useRef<ReturnType<typeof forceSimulation<SimNode>> | null>(null)

  // Build graph data
  const graphData = useMemo(
    () => buildGraphData(entries, entryTagsMap, references, 200),
    [entries, entryTagsMap, references]
  )

  // Run simulation when data changes
  useEffect(() => {
    if (graphData.nodes.length === 0) {
      setNodes([])
      setLinks([])
      setIsSimulating(false)
      return
    }

    // Stop previous simulation
    if (simulationRef.current) {
      simulationRef.current.stop()
    }

    // Create simulation nodes (clone to avoid mutating original)
    const simNodes: SimNode[] = graphData.nodes.map((n) => ({
      ...n,
      x: undefined,
      y: undefined,
    }))

    // Create simulation links
    const simLinks: SimLink[] = graphData.edges.map((e) => ({
      source: e.source,
      target: e.target,
      type: e.type,
      weight: e.weight,
      label: e.label,
    }))

    const nodeRadius = (n: SimNode) => Math.max(8, Math.min(20, 6 + n.connectionCount * 2))

    setIsSimulating(true)

    const simulation = forceSimulation<SimNode>(simNodes)
      .force(
        'link',
        forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance((d) => (d.type === 'reference' ? 80 : 120 / d.weight))
          .strength((d) => (d.type === 'reference' ? 0.8 : 0.3 * d.weight))
      )
      .force('charge', forceManyBody<SimNode>().strength(-150))
      .force('center', forceCenter(width / 2, height / 2).strength(0.05))
      .force('collide', forceCollide<SimNode>().radius((d) => nodeRadius(d) + 8))
      .alphaDecay(0.02)
      .velocityDecay(0.3)

    simulation.on('tick', () => {
      setNodes([...simNodes])
      setLinks([...simLinks])
    })

    simulation.on('end', () => {
      setIsSimulating(false)
    })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [graphData, width, height])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [])

  const reheat = useCallback(() => {
    if (simulationRef.current) {
      setIsSimulating(true)
      simulationRef.current.alpha(0.5).restart()
    }
  }, [])

  return { nodes, links, isSimulating, graphData }
}
