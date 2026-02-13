import { useRef, useState, useCallback, useEffect } from 'react'
import { Network } from 'lucide-react'
import { useGraph } from '@/hooks/useGraph'
import { useAllReferences } from '@/hooks/useReferences'
import { useEntryStore } from '@/store/useEntryStore'
import { useTagStore } from '@/store/useTagStore'
import { useGraphStore } from '@/store/useGraphStore'
import { GraphNode } from '@/components/graph/GraphNode'
import { GraphControls } from '@/components/graph/GraphControls'
import type { Entry } from '@/types'

interface GraphViewProps {
  entries: Entry[]
}

// Edge color mapping
const EDGE_COLORS = {
  reference: { stroke: '#6366f1', opacity: 0.6 },  // indigo for manual refs
  tag: { stroke: '#94a3b8', opacity: 0.25 },        // slate for tag connections
}

export function GraphView({ entries }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })

  const { zoom, panX, panY, setZoom, setPan } = useGraphStore()
  const entryTagsMap = useTagStore((s) => s.entryTagsMap)
  const { openModal } = useEntryStore()
  const { references } = useAllReferences()

  // Measure container
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width: Math.max(400, width), height: Math.max(300, height) })
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Run graph simulation
  const { nodes, links, isSimulating, graphData } = useGraph(
    entries,
    entryTagsMap,
    references,
    dimensions.width,
    dimensions.height
  )

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.92 : 1.08
      setZoom(zoom * delta)
    },
    [zoom, setZoom]
  )

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      // Only pan if clicking on background (not on a node)
      if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).tagName === 'rect') {
        setIsPanning(true)
        setPanStart({ x: e.clientX - panX, y: e.clientY - panY })
      }
    },
    [panX, panY]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return
      setPan(e.clientX - panStart.x, e.clientY - panStart.y)
    },
    [isPanning, panStart, setPan]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  // Empty state
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Network size={40} className="text-neutral-200 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Geen entries</p>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
            Maak entries aan om de graph te zien
          </p>
        </div>
      </div>
    )
  }

  // No connections state
  if (graphData.edges.length === 0 && graphData.nodes.length > 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <Network size={40} className="text-neutral-200 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Geen connecties</p>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-1 max-w-xs mx-auto">
            Voeg tags of verwijzingen toe aan entries om verbindingen te zien
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Background for pan detection */}
        <rect
          width={dimensions.width}
          height={dimensions.height}
          fill="transparent"
        />

        {/* Transform group for zoom/pan */}
        <g
          transform={`translate(${panX}, ${panY}) scale(${zoom})`}
        >
          {/* Edges */}
          {links.map((link, i) => {
            const source = typeof link.source === 'object' ? link.source : null
            const target = typeof link.target === 'object' ? link.target : null
            if (!source || !target || source.x == null || source.y == null || target.x == null || target.y == null) return null

            const colors = EDGE_COLORS[link.type]
            const isHighlighted =
              hoveredNode === source.id || hoveredNode === target.id

            return (
              <line
                key={`edge-${i}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={colors.stroke}
                strokeWidth={Math.max(0.5, link.weight * (link.type === 'reference' ? 2 : 0.8))}
                opacity={isHighlighted ? 0.8 : hoveredNode ? 0.08 : colors.opacity}
                strokeDasharray={link.type === 'reference' ? 'none' : '3,3'}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            if (node.x == null || node.y == null) return null

            return (
              <GraphNode
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                title={node.title}
                entryType={node.entryType}
                connectionCount={node.connectionCount}
                isHovered={hoveredNode === node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => openModal(node.entry)}
              />
            )
          })}
        </g>
      </svg>

      {/* Controls overlay */}
      <GraphControls
        nodeCount={graphData.nodes.length}
        edgeCount={graphData.edges.length}
        isSimulating={isSimulating}
      />

      {/* Hovered node tooltip */}
      {hoveredNode && (() => {
        const node = nodes.find((n) => n.id === hoveredNode)
        if (!node || node.x == null || node.y == null) return null

        return (
          <div
            className="absolute pointer-events-none bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 shadow-lg px-3 py-2 z-10"
            style={{
              left: Math.min(dimensions.width - 200, Math.max(10, node.x * zoom + panX + 30)),
              top: Math.max(10, node.y * zoom + panY - 20),
            }}
          >
            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate max-w-[180px]">
              {node.title}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {node.connectionCount} connectie{node.connectionCount !== 1 ? 's' : ''}
            </p>
            {node.entry.content && (
              <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 max-w-[180px]">
                {node.entry.content}
              </p>
            )}
          </div>
        )
      })()}
    </div>
  )
}
