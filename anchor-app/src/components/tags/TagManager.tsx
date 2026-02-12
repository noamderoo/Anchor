import { useState } from 'react'
import { Settings, Trash2, Check } from 'lucide-react'
import { useTagStore } from '@/store/useTagStore'
import { useToastStore } from '@/store/useToastStore'
import { TagBadge } from '@/components/tags/TagBadge'
import { getTagColors } from '@/utils/colorPalette'

/**
 * TagManager — full tag management panel for settings/sidebar.
 * Allows editing tag colors and deleting tags.
 */
export function TagManager() {
  const { tags, updateTag, deleteTag, isLoading } = useTagStore()
  const addToast = useToastStore((s) => s.addToast)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const colors = getTagColors()

  const handleColorChange = async (tagId: string, color: string) => {
    try {
      await updateTag(tagId, { color })
      setEditingId(null)
      addToast('Tag kleur bijgewerkt', 'success')
    } catch {
      addToast('Kleur bijwerken mislukt', 'error')
    }
  }

  const handleDelete = async (tagId: string) => {
    try {
      await deleteTag(tagId)
      setConfirmDeleteId(null)
      addToast('Tag verwijderd', 'info')
    } catch {
      addToast('Verwijderen mislukt', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-neutral-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return (
      <div className="p-6 text-center">
        <Settings size={24} className="text-neutral-300 mx-auto mb-2" />
        <p className="text-sm text-neutral-400">
          Nog geen tags. Maak tags aan bij het bewerken van een entry.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider px-3 mb-2">
        Tags beheren
      </h3>

      {tags.map((tag) => (
        <div key={tag.id} className="relative">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 group transition-colors">
            <TagBadge tag={tag} size="md" />
            <span className="flex-1" />

            {/* Edit color button */}
            <button
              onClick={() => setEditingId(editingId === tag.id ? null : tag.id)}
              className="p-1 rounded text-neutral-300 hover:text-neutral-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              title="Kleur aanpassen"
            >
              <Settings size={14} />
            </button>

            {/* Delete button */}
            <button
              onClick={() => setConfirmDeleteId(tag.id)}
              className="p-1 rounded text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
              title="Tag verwijderen"
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Color picker */}
          {editingId === tag.id && (
            <div className="mx-3 mb-2 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
              <p className="text-xs text-neutral-400 mb-2">Kies een kleur</p>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(tag.id, color)}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center"
                    style={{
                      backgroundColor: color,
                      borderColor: tag.color === color ? '#1e293b' : 'transparent',
                    }}
                  >
                    {tag.color === color && <Check size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delete confirm */}
          {confirmDeleteId === tag.id && (
            <div className="mx-3 mb-2 p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="text-xs text-red-600 mb-2">
                Tag "{tag.name}" verwijderen? Dit verwijdert de tag van alle entries.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-2.5 py-1 text-xs font-medium text-neutral-600 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
