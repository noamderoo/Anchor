import { X } from 'lucide-react'

interface FilterTagProps {
  label: string
  color?: string
  onRemove: () => void
}

/**
 * Active filter indicator pill with remove button.
 * Used to show active filters above views.
 */
export function FilterTag({ label, color, onRemove }: FilterTagProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300"
      style={color ? { backgroundColor: `${color}15`, color } : undefined}
    >
      {label}
      <button
        onClick={onRemove}
        className="hover:opacity-70 cursor-pointer"
        aria-label={`Filter "${label}" verwijderen`}
      >
        <X size={12} />
      </button>
    </span>
  )
}
