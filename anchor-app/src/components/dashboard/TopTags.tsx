import { Hash } from 'lucide-react'
import { useTopTags } from '@/hooks/useTopTags'
import { getTagBgColor, getTagBorderColor } from '@/utils/colorPalette'

export function TopTags() {
  const topTags = useTopTags(5)

  if (topTags.length === 0) {
    return null // Geen tags met entries, toon niets
  }

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Hash size={12} className="text-emerald-400" />
        Top tags
      </h2>
      <div className="space-y-1.5">
        {topTags.map(({ tag, count }) => (
          <div
            key={tag.id}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: getTagBgColor(tag.color),
              borderColor: getTagBorderColor(tag.color),
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 flex-1 truncate">
              {tag.name}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium tabular-nums">
              {count} {count === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
