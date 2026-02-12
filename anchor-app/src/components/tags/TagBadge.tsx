import type { Tag } from '@/types'
import { getTagBgColor, getTagBorderColor } from '@/utils/colorPalette'
import { X } from 'lucide-react'

interface TagBadgeProps {
  tag: Tag
  size?: 'sm' | 'md'
  removable?: boolean
  onRemove?: () => void
  onClick?: () => void
}

export function TagBadge({ tag, size = 'sm', removable = false, onRemove, onClick }: TagBadgeProps) {
  const sizeClasses = size === 'sm'
    ? 'text-[11px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full transition-colors
        ${sizeClasses}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
      `}
      style={{
        backgroundColor: getTagBgColor(tag.color),
        border: `1px solid ${getTagBorderColor(tag.color)}`,
        color: tag.color,
      }}
      onClick={onClick}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: tag.color }}
      />
      {tag.name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full hover:bg-black/10 p-0.5 transition-colors cursor-pointer"
          aria-label={`Tag "${tag.name}" verwijderen`}
        >
          <X size={size === 'sm' ? 10 : 12} />
        </button>
      )}
    </span>
  )
}
