import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
} from 'lucide-react'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import type { Entry, EntryType } from '@/types'

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: Link,
  bookmark: Bookmark,
}

interface ReferenceSelectorProps {
  entries: Entry[]
  excludeIds: string[]
  onSelect: (entry: Entry) => void
  onClose: () => void
}

export function ReferenceSelector({
  entries,
  excludeIds,
  onSelect,
  onClose,
}: ReferenceSelectorProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const excludeSet = new Set(excludeIds)
  const filtered = entries
    .filter((e) => !excludeSet.has(e.id))
    .filter((e) => !e.archived)
    .filter((e) => e.id !== '' && !e.id.startsWith('temp-'))
    .filter((e) => {
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return (
        (e.title?.toLowerCase().includes(q)) ||
        (e.content?.toLowerCase().includes(q)) ||
        ENTRY_TYPE_CONFIGS[e.entry_type].label.toLowerCase().includes(q)
      )
    })
    .slice(0, 10)

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-200 bg-white focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
        <Search size={14} className="text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek een entry om te verwijzen..."
          className="flex-1 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none bg-transparent"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {(query.trim() || filtered.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-neutral-200 shadow-lg max-h-52 overflow-y-auto z-20">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-neutral-400">
              Geen resultaten
            </div>
          ) : (
            filtered.map((entry) => {
              const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
              const Icon = ENTRY_ICONS[entry.entry_type]

              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    onSelect(entry)
                    onClose()
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `var(--color-${config.color})15` }}
                  >
                    <Icon size={12} style={{ color: `var(--color-${config.color})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900 truncate">
                      {entry.title || 'Zonder titel'}
                    </p>
                    <p className="text-[11px] text-neutral-400">{config.label}</p>
                  </div>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
