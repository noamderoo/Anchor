import { useState } from 'react'
import { Plus, ArrowRight, ArrowLeft, X, AlertTriangle } from 'lucide-react'
import {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link as LinkIcon,
  Bookmark,
} from 'lucide-react'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import { useEntryStore } from '@/store/useEntryStore'
import { ReferenceSelector } from '@/components/entry/ReferenceSelector'
import type { Entry, EntryType, EntryReference } from '@/types'

const ENTRY_ICONS: Record<EntryType, typeof GraduationCap> = {
  lesson: GraduationCap,
  idea: Lightbulb,
  milestone: Trophy,
  note: StickyNote,
  resource: LinkIcon,
  bookmark: Bookmark,
}

interface EntryReferencesProps {
  entryId: string
  outgoing: EntryReference[]
  incoming: EntryReference[]
  isLoading: boolean
  onAddReference: (toEntryId: string) => Promise<void>
  onRemoveReference: (referenceId: string) => Promise<void>
}

export function EntryReferences({
  entryId,
  outgoing,
  incoming,
  isLoading,
  onAddReference,
  onRemoveReference,
}: EntryReferencesProps) {
  const [showSelector, setShowSelector] = useState(false)
  const entries = useEntryStore((s) => s.entries)

  // Build a lookup map for referenced entries
  const entryMap = new Map(entries.map((e) => [e.id, e]))

  // IDs to exclude from reference selector (self + already referenced)
  const excludeIds = [
    entryId,
    ...outgoing.map((r) => r.to_entry_id),
  ]

  const hasReferences = outgoing.length > 0 || incoming.length > 0

  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
          Verwijzingen
        </label>
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-neutral-100 rounded w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 pt-4 border-t border-neutral-100">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Verwijzingen
        </label>
        {!showSelector && entryId && entryId !== '' && (
          <button
            onClick={() => setShowSelector(true)}
            className="flex items-center gap-1 text-xs text-primary-500 hover:text-primary-700 transition-colors cursor-pointer"
          >
            <Plus size={12} />
            Toevoegen
          </button>
        )}
      </div>

      {/* Reference selector */}
      {showSelector && (
        <div className="mb-3">
          <ReferenceSelector
            entries={entries}
            excludeIds={excludeIds}
            onSelect={async (entry) => {
              await onAddReference(entry.id)
            }}
            onClose={() => setShowSelector(false)}
          />
        </div>
      )}

      {/* Referenced entries */}
      {!hasReferences && !showSelector && (
        <p className="text-xs text-neutral-400">Geen verwijzingen</p>
      )}

      {/* Outgoing references (from this entry) */}
      {outgoing.length > 0 && (
        <div className="space-y-1 mb-2">
          {outgoing.map((ref) => {
            const targetEntry = entryMap.get(ref.to_entry_id)
            return (
              <ReferenceItem
                key={ref.id}
                entry={targetEntry || null}
                direction="outgoing"
                onRemove={() => onRemoveReference(ref.id)}
                onOpen={targetEntry ? () => useEntryStore.getState().openModal(targetEntry) : undefined}
              />
            )
          })}
        </div>
      )}

      {/* Incoming references (to this entry) */}
      {incoming.length > 0 && (
        <div className="space-y-1">
          {incoming.length > 0 && outgoing.length > 0 && (
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-2 mb-1">
              Verwezen door
            </p>
          )}
          {incoming.map((ref) => {
            const sourceEntry = entryMap.get(ref.from_entry_id)
            return (
              <ReferenceItem
                key={ref.id}
                entry={sourceEntry || null}
                direction="incoming"
                onOpen={sourceEntry ? () => useEntryStore.getState().openModal(sourceEntry) : undefined}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

function ReferenceItem({
  entry,
  direction,
  onRemove,
  onOpen,
}: {
  entry: Entry | null
  direction: 'outgoing' | 'incoming'
  onRemove?: () => void
  onOpen?: () => void
}) {
  const DirectionIcon = direction === 'outgoing' ? ArrowRight : ArrowLeft
  const directionColor = direction === 'outgoing' ? 'text-primary-400' : 'text-neutral-400'

  if (!entry) {
    // Broken reference
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-red-50 border border-red-100">
        <AlertTriangle size={12} className="text-red-400 shrink-0" />
        <span className="text-xs text-red-400 flex-1">[Verwijderde entry]</span>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-0.5 text-red-400 hover:text-red-600 cursor-pointer"
            title="Verwijzing verwijderen"
          >
            <X size={12} />
          </button>
        )}
      </div>
    )
  }

  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const Icon = ENTRY_ICONS[entry.entry_type]

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors group">
      <DirectionIcon size={12} className={`${directionColor} shrink-0`} />
      <div
        className="w-5 h-5 rounded flex items-center justify-center shrink-0"
        style={{ backgroundColor: `var(--color-${config.color})15` }}
      >
        <Icon size={10} style={{ color: `var(--color-${config.color})` }} />
      </div>
      {onOpen ? (
        <button
          onClick={onOpen}
          className="text-xs text-neutral-700 hover:text-primary-600 truncate flex-1 text-left cursor-pointer transition-colors"
        >
          {entry.title || 'Zonder titel'}
        </button>
      ) : (
        <span className="text-xs text-neutral-700 truncate flex-1">
          {entry.title || 'Zonder titel'}
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
          title="Verwijzing verwijderen"
        >
          <X size={12} />
        </button>
      )}
    </div>
  )
}
