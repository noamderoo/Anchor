import { useState, useCallback } from 'react'
import type { Entry, EntryUpdate } from '@/types'
import { ENTRY_TYPE_CONFIGS } from '@/types'

interface EntryFormProps {
  entry: Entry
  onChange: (updates: EntryUpdate) => void
}

export function EntryForm({ entry, onChange }: EntryFormProps) {
  const config = ENTRY_TYPE_CONFIGS[entry.entry_type]
  const [localTitle, setLocalTitle] = useState(entry.title)
  const [localContent, setLocalContent] = useState(entry.content || '')
  const [localStatus, setLocalStatus] = useState(entry.status || '')
  const [localCustomDate, setLocalCustomDate] = useState(
    entry.custom_date ? entry.custom_date.slice(0, 10) : ''
  )

  const handleTitleChange = useCallback(
    (value: string) => {
      setLocalTitle(value)
      onChange({ title: value })
    },
    [onChange]
  )

  const handleContentChange = useCallback(
    (value: string) => {
      setLocalContent(value)
      onChange({ content: value || null })
    },
    [onChange]
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      setLocalStatus(value)
      onChange({ status: value || null })
    },
    [onChange]
  )

  const handleDateChange = useCallback(
    (value: string) => {
      setLocalCustomDate(value)
      onChange({ custom_date: value ? new Date(value).toISOString() : null })
    },
    [onChange]
  )

  const contentLabel = getContentLabel(entry.entry_type)
  const showStatus = config.suggestedFields.includes('status')
  const showDate = config.suggestedFields.includes('custom_date')

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <input
          type="text"
          value={localTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Titel"
          className="w-full text-xl font-semibold text-neutral-900 dark:text-neutral-100 placeholder-neutral-300 dark:placeholder-neutral-600 border-0 border-b-2 border-transparent focus:border-primary-300 dark:focus:border-primary-600 bg-transparent outline-none pb-2 transition-colors"
          autoFocus
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
          {contentLabel}
        </label>
        <textarea
          value={localContent}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={getContentPlaceholder(entry.entry_type)}
          rows={6}
          className="w-full text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-600 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg p-3 outline-none focus:border-primary-300 dark:focus:border-primary-600 focus:bg-white dark:focus:bg-neutral-700 resize-y transition-colors"
        />
      </div>

      {/* Status */}
      {showStatus && (
        <div>
          <label className="block text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <input
            type="text"
            value={localStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            placeholder="Bijv. in progress, afgerond, idee fase..."
            className="w-full text-sm text-neutral-700 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-600 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg px-3 py-2 outline-none focus:border-primary-300 dark:focus:border-primary-600 focus:bg-white dark:focus:bg-neutral-700 transition-colors"
          />
        </div>
      )}

      {/* Custom Date */}
      {showDate && (
        <div>
          <label className="block text-xs font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1.5">
            Datum
          </label>
          <input
            type="date"
            value={localCustomDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="text-sm text-neutral-700 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 rounded-lg px-3 py-2 outline-none focus:border-primary-300 dark:focus:border-primary-600 focus:bg-white dark:focus:bg-neutral-700 transition-colors"
          />
        </div>
      )}
    </div>
  )
}

function getContentLabel(type: Entry['entry_type']): string {
  switch (type) {
    case 'lesson': return 'Wat heb je geleerd?'
    case 'idea': return 'Beschrijf je idee'
    case 'milestone': return 'Beschrijving'
    case 'note': return 'Notitie'
    case 'resource': return 'Waarom relevant?'
    case 'bookmark': return 'Wat wil je ermee?'
    default: return 'Inhoud'
  }
}

function getContentPlaceholder(type: Entry['entry_type']): string {
  switch (type) {
    case 'lesson': return 'Beschrijf wat je hebt geleerd en in welke context...'
    case 'idea': return 'Beschrijf je idee, hoe ruw ook...'
    case 'milestone': return 'Wat heb je bereikt? Waar ben je trots op?'
    case 'note': return 'Schrijf je gedachte of observatie...'
    case 'resource': return 'Waarom is deze resource interessant of nuttig?'
    case 'bookmark': return 'Wat wil je hiermee doen? Waarom bewaar je dit?'
    default: return 'Schrijf hier...'
  }
}
