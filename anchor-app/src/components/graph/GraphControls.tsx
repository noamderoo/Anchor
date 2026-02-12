import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useGraphStore } from '@/store/useGraphStore'

interface GraphControlsProps {
  nodeCount: number
  edgeCount: number
  isSimulating: boolean
}

export function GraphControls({ nodeCount, edgeCount, isSimulating }: GraphControlsProps) {
  const { zoom, zoomIn, zoomOut, resetView } = useGraphStore()

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
      {/* Stats */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 px-3 py-2 shadow-sm">
        <div className="flex items-center gap-3 text-[11px] text-neutral-500">
          <span>{nodeCount} entries</span>
          <span>·</span>
          <span>{edgeCount} connecties</span>
          {isSimulating && (
            <>
              <span>·</span>
              <span className="text-primary-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                Berekenen...
              </span>
            </>
          )}
        </div>
      </div>

      {/* Zoom controls */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-neutral-200 shadow-sm flex items-center">
        <button
          onClick={zoomOut}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-l-lg transition-colors cursor-pointer"
          title="Uitzoomen"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-[11px] text-neutral-500 px-2 border-x border-neutral-200 min-w-[3.5rem] text-center tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={zoomIn}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          title="Inzoomen"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-r-lg transition-colors cursor-pointer border-l border-neutral-200"
          title="Reset weergave"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  )
}
