import type { EntryType } from '@/types'

// Color hex values per entry type (for SVG rendering)
const TYPE_COLORS: Record<EntryType, { fill: string; stroke: string; text: string }> = {
  lesson: { fill: '#f3e8ff', stroke: '#a855f7', text: '#7c3aed' },
  idea: { fill: '#fef3c7', stroke: '#f59e0b', text: '#d97706' },
  milestone: { fill: '#dcfce7', stroke: '#22c55e', text: '#16a34a' },
  note: { fill: '#f1f5f9', stroke: '#94a3b8', text: '#64748b' },
  resource: { fill: '#dbeafe', stroke: '#3b82f6', text: '#2563eb' },
  bookmark: { fill: '#fce7f3', stroke: '#ec4899', text: '#db2777' },
}

interface GraphNodeProps {
  id: string
  x: number
  y: number
  title: string
  entryType: EntryType
  connectionCount: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

export function GraphNode({
  x,
  y,
  title,
  entryType,
  connectionCount,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: GraphNodeProps) {
  const radius = Math.max(8, Math.min(20, 6 + connectionCount * 2))
  const colors = TYPE_COLORS[entryType]

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Glow effect on hover */}
      {isHovered && (
        <circle
          r={radius + 6}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={2}
          opacity={0.3}
        />
      )}

      {/* Node circle */}
      <circle
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={isHovered ? 2.5 : 1.5}
      />

      {/* Entry type icon (centered, as a small colored dot) */}
      <circle
        r={3}
        fill={colors.stroke}
        opacity={0.8}
      />

      {/* Label (shown on hover or for well-connected nodes) */}
      {(isHovered || connectionCount >= 3) && (
        <g>
          {/* Label background — uses CSS var for dark mode */}
          <rect
            x={radius + 6}
            y={-9}
            width={Math.min(title.length * 5.5 + 12, 140)}
            height={18}
            rx={4}
            className="fill-white dark:fill-neutral-800"
            stroke={colors.stroke}
            strokeWidth={0.5}
            opacity={0.95}
          />
          {/* Label text */}
          <text
            x={radius + 12}
            y={4}
            fontSize={11}
            fill={colors.text}
            fontWeight={isHovered ? 600 : 400}
            fontFamily="system-ui, sans-serif"
          >
            {title.length > 22 ? title.slice(0, 20) + '…' : title}
          </text>
        </g>
      )}
    </g>
  )
}
