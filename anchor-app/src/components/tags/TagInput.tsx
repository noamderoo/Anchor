import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Hash } from 'lucide-react'
import { useTagStore } from '@/store/useTagStore'
import { TagBadge } from '@/components/tags/TagBadge'
import type { Tag } from '@/types'

interface TagInputProps {
  entryId: string
  entryTags: Tag[]
  onTagAdded?: (tag: Tag) => void
  onTagRemoved?: (tagId: string) => void
}

export function TagInput({ entryId, entryTags, onTagAdded, onTagRemoved }: TagInputProps) {
  const { tags: allTags, addTagToEntry, removeTagFromEntry, createAndAddTag } = useTagStore()

  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter available tags: exclude already assigned, match query
  const entryTagIds = new Set(entryTags.map((t) => t.id))
  const filteredTags = allTags.filter(
    (tag) =>
      !entryTagIds.has(tag.id) &&
      tag.name.toLowerCase().includes(query.toLowerCase().trim())
  )

  const trimmedQuery = query.trim().toLowerCase()
  const exactMatch = allTags.some((t) => t.name === trimmedQuery)
  const showCreateOption = trimmedQuery.length > 0 && !exactMatch

  const options = [
    ...filteredTags,
    ...(showCreateOption ? [{ id: '__create__', name: trimmedQuery } as Tag] : []),
  ]

  // Reset highlight when options change
  useEffect(() => {
    setHighlightIndex(0)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  const handleSelect = useCallback(
    async (tag: Tag | { id: '__create__'; name: string }) => {
      if (tag.id === '__create__') {
        // Create new tag and add to entry
        try {
          const isNewEntry = !entryId || entryId === ''
          if (isNewEntry) {
            // For new entries, just create the tag — linking happens after save
            const created = await useTagStore.getState().createTag(tag.name)
            onTagAdded?.(created)
          } else {
            const created = await createAndAddTag(entryId, tag.name)
            onTagAdded?.(created)
          }
        } catch {
          // Error handled in store
        }
      } else {
        // Add existing tag to entry
        try {
          const isNewEntry = !entryId || entryId === ''
          if (isNewEntry) {
            // For new entries, track locally
            onTagAdded?.(tag as Tag)
          } else {
            await addTagToEntry(entryId, tag.id)
            onTagAdded?.(tag as Tag)
          }
        } catch {
          // Error handled in store
        }
      }
      setQuery('')
      setIsOpen(false)
      inputRef.current?.focus()
    },
    [entryId, addTagToEntry, createAndAddTag, onTagAdded]
  )

  const handleRemove = useCallback(
    async (tagId: string) => {
      const isNewEntry = !entryId || entryId === ''
      if (isNewEntry) {
        onTagRemoved?.(tagId)
      } else {
        try {
          await removeTagFromEntry(entryId, tagId)
          onTagRemoved?.(tagId)
        } catch {
          // Error handled in store
        }
      }
    },
    [entryId, removeTagFromEntry, onTagRemoved]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlightIndex((i) => Math.min(i + 1, options.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlightIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (options[highlightIndex]) {
          handleSelect(options[highlightIndex])
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    },
    [options, highlightIndex, handleSelect]
  )

  return (
    <div className="space-y-2">
      {/* Current tags */}
      {entryTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entryTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              size="md"
              removable
              onRemove={() => handleRemove(tag.id)}
            />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 0)
          }}
          className={`
            flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300
            transition-colors cursor-pointer
            ${isOpen ? 'hidden' : ''}
          `}
        >
          <Plus size={14} />
          Tag toevoegen
        </button>

        {isOpen && (
          <div className="relative">
            <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-600 rounded-lg px-3 py-2 bg-white dark:bg-neutral-800 focus-within:border-primary-300 dark:focus-within:border-primary-500 transition-colors">
              <Hash size={14} className="text-neutral-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zoek of maak tag..."
                className="flex-1 text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-500 outline-none bg-transparent"
                autoFocus
              />
            </div>

            {/* Dropdown */}
            {options.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden z-20 max-h-48 overflow-y-auto"
              >
                {options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors cursor-pointer
                      ${index === highlightIndex ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'}
                    `}
                  >
                    {option.id === '__create__' ? (
                      <>
                        <Plus size={14} className="text-primary-500 shrink-0" />
                        <span>
                          Maak <strong>"{option.name}"</strong>
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: (option as Tag).color }}
                        />
                        <span>{option.name}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* No results */}
            {options.length === 0 && query.trim() === '' && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg p-3 z-20"
              >
                <p className="text-xs text-neutral-500 text-center">
                  Typ om een tag te zoeken of aan te maken
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
