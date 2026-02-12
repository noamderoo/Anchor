import { useEffect, useRef, useCallback, useState } from 'react'
import {
  X,
  Archive,
  Trash2,
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
} from 'lucide-react'
import { useEntryStore } from '@/store/useEntryStore'
import { useTagStore } from '@/store/useTagStore'
import { useToastStore } from '@/store/useToastStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import { EntryForm } from '@/components/entry/EntryForm'
import { TagInput } from '@/components/tags/TagInput'
import { ENTRY_TYPE_CONFIGS } from '@/types'
import type { Entry, EntryUpdate, Tag } from '@/types'

const iconComponents: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Lightbulb,
  Trophy,
  StickyNote,
  Link,
  Bookmark,
}

const borderColors: Record<Entry['entry_type'], string> = {
  lesson: 'border-t-purple-400',
  idea: 'border-t-amber-400',
  milestone: 'border-t-green-400',
  note: 'border-t-slate-400',
  resource: 'border-t-blue-400',
  bookmark: 'border-t-pink-400',
}

const iconColors: Record<Entry['entry_type'], string> = {
  lesson: 'text-purple-500',
  idea: 'text-amber-500',
  milestone: 'text-green-500',
  note: 'text-slate-500',
  resource: 'text-blue-500',
  bookmark: 'text-pink-500',
}

export function EntryModal() {
  const {
    isModalOpen,
    editingEntry,
    closeModal,
    createEntry,
    updateEntry,
    archiveEntry,
    deleteEntry,
  } = useEntryStore()

  const addToast = useToastStore((s) => s.addToast)
  const { loadTagsForEntry, addTagToEntry } = useTagStore()
  const entryTagsMap = useTagStore((s) => s.entryTagsMap)
  const modalRef = useRef<HTMLDivElement>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pendingTags, setPendingTags] = useState<Tag[]>([])
  const isNew = editingEntry?.id === ''

  // Load tags for existing entry when modal opens
  useEffect(() => {
    if (isModalOpen && editingEntry && !isNew) {
      loadTagsForEntry(editingEntry.id)
    }
    if (isModalOpen && isNew) {
      setPendingTags([])
    }
  }, [isModalOpen, editingEntry?.id, isNew, loadTagsForEntry])

  // Get current entry tags (from store for existing, local for new)
  const entryTags = isNew ? pendingTags : (editingEntry ? (entryTagsMap[editingEntry.id] || []) : [])

  // Auto-save for existing entries
  const { schedule, flush, cancel } = useAutoSave({
    onSave: async (updates) => {
      if (!editingEntry || isNew) return
      try {
        await updateEntry(editingEntry.id, updates)
        setHasUnsavedChanges(false)
        addToast('Opgeslagen', 'success')
      } catch {
        addToast('Opslaan mislukt', 'error')
      }
    },
    delay: 3000,
    enabled: !isNew && !!editingEntry?.id,
  })

  const handleChange = useCallback(
    (updates: EntryUpdate) => {
      setHasUnsavedChanges(true)
      if (isNew) return // Don't auto-save new entries
      schedule(updates)
    },
    [isNew, schedule]
  )

  const handleSaveNew = useCallback(async () => {
    if (!editingEntry || !isNew) return
    if (!editingEntry.title.trim()) {
      addToast('Titel is verplicht', 'error')
      return
    }
    try {
      const created = await createEntry({
        title: editingEntry.title,
        content: editingEntry.content,
        entry_type: editingEntry.entry_type,
        status: editingEntry.status,
        custom_date: editingEntry.custom_date,
        image_url: null,
        archived: false,
      })
      setHasUnsavedChanges(false)
      addToast('Entry aangemaakt!', 'success')
      // Link pending tags to the newly created entry
      for (const tag of pendingTags) {
        try {
          await addTagToEntry(created.id, tag.id)
        } catch {
          // Continue linking remaining tags
        }
      }
      setPendingTags([])
    } catch {
      addToast('Aanmaken mislukt', 'error')
    }
  }, [editingEntry, isNew, createEntry, addToast, pendingTags, addTagToEntry])

  // For new entries: keep track of form state locally via the store
  const handleNewEntryChange = useCallback(
    (updates: EntryUpdate) => {
      if (!editingEntry) return
      setHasUnsavedChanges(true)
      // Update editingEntry in store directly for new entries
      useEntryStore.setState({
        editingEntry: { ...editingEntry, ...updates } as Entry,
      })
    },
    [editingEntry]
  )

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('Je hebt onopgeslagen wijzigingen. Wil je sluiten?')
      if (!confirmed) return
    }
    cancel()
    setHasUnsavedChanges(false)
    setShowDeleteConfirm(false)
    closeModal()
  }, [hasUnsavedChanges, cancel, closeModal])

  const handleArchive = useCallback(async () => {
    if (!editingEntry || isNew) return
    try {
      await archiveEntry(editingEntry.id)
      addToast('Entry gearchiveerd', 'success')
      setHasUnsavedChanges(false)
      closeModal()
    } catch {
      addToast('Archiveren mislukt', 'error')
    }
  }, [editingEntry, isNew, archiveEntry, addToast, closeModal])

  const handleDelete = useCallback(async () => {
    if (!editingEntry || isNew) return
    try {
      await deleteEntry(editingEntry.id)
      addToast('Entry verwijderd', 'info')
      setHasUnsavedChanges(false)
      setShowDeleteConfirm(false)
      closeModal()
    } catch {
      addToast('Verwijderen mislukt', 'error')
    }
  }, [editingEntry, isNew, deleteEntry, addToast, closeModal])

  // Focus trap & Escape key
  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isModalOpen, handleClose])

  // Flush auto-save before unload
  useEffect(() => {
    const handleBeforeUnload = () => flush()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [flush])

  if (!isModalOpen || !editingEntry) return null

  const config = ENTRY_TYPE_CONFIGS[editingEntry.entry_type]
  const Icon = iconComponents[config.icon] || StickyNote

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] mx-4
          flex flex-col overflow-hidden border-t-4
          animate-scale-in
          ${borderColors[editingEntry.entry_type]}
        `}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? `Nieuwe ${config.label}` : editingEntry.title}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Icon size={18} className={iconColors[editingEntry.entry_type]} />
            <span className="text-sm font-medium text-neutral-500">{config.label}</span>
            {hasUnsavedChanges && (
              <span className="text-xs text-neutral-400 ml-2">• Niet opgeslagen</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {!isNew && (
              <>
                <button
                  onClick={handleArchive}
                  className="p-2 rounded-lg text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="Archiveren"
                  aria-label="Entry archiveren"
                >
                  <Archive size={16} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Verwijderen"
                  aria-label="Entry verwijderen"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer ml-1"
              aria-label="Sluiten"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <EntryForm
            entry={editingEntry}
            onChange={isNew ? handleNewEntryChange : handleChange}
          />

          {/* Tags */}
          <div className="mt-5 pt-4 border-t border-neutral-100">
            <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
              Tags
            </label>
            <TagInput
              entryId={editingEntry.id}
              entryTags={entryTags}
              onTagAdded={(tag) => {
                if (isNew) {
                  setPendingTags((prev) => [...prev, tag])
                }
              }}
              onTagRemoved={(tagId) => {
                if (isNew) {
                  setPendingTags((prev) => prev.filter((t) => t.id !== tagId))
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          <div className="text-xs text-neutral-400">
            {!isNew && (
              <>
                Aangemaakt: {new Date(editingEntry.created_at).toLocaleDateString('nl-NL', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </>
            )}
          </div>

          {isNew ? (
            <button
              onClick={handleSaveNew}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
            >
              Opslaan
            </button>
          ) : (
            <div className="text-xs text-neutral-400">
              Auto-save na 3 seconden
            </div>
          )}
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
            <div className="text-center p-6">
              <Trash2 size={32} className="text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                Entry definitief verwijderen?
              </h3>
              <p className="text-sm text-neutral-500 mb-5">
                Dit kan niet ongedaan worden gemaakt.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
