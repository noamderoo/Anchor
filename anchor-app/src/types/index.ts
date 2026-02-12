// ─── Entry Types ───

export type EntryType = 'lesson' | 'idea' | 'milestone' | 'note' | 'resource' | 'bookmark'

export type EntryStatus = string // Vrij in te vullen door gebruiker

export interface Entry {
  id: string
  title: string
  content: string | null
  entry_type: EntryType
  status: EntryStatus | null
  custom_date: string | null // ISO timestamp
  image_url: string | null
  created_at: string
  updated_at: string
  archived: boolean
}

// Nieuw entry (nog niet opgeslagen)
export type NewEntry = Omit<Entry, 'id' | 'created_at' | 'updated_at'>

// Entry update (partial)
export type EntryUpdate = Partial<Omit<Entry, 'id' | 'created_at' | 'updated_at'>>

// ─── Entry Type Metadata ───

export interface EntryTypeConfig {
  type: EntryType
  label: string
  description: string
  icon: string // Lucide icon name
  color: string // Tailwind color class
  suggestedFields: string[]
}

export const ENTRY_TYPE_CONFIGS: Record<EntryType, EntryTypeConfig> = {
  lesson: {
    type: 'lesson',
    label: 'Lesson Learned',
    description: 'Iets wat je hebt geleerd door ervaring',
    icon: 'GraduationCap',
    color: 'entry-lesson',
    suggestedFields: ['title', 'content', 'status'],
  },
  idea: {
    type: 'idea',
    label: 'Idee',
    description: 'Een ruw idee of concept',
    icon: 'Lightbulb',
    color: 'entry-idea',
    suggestedFields: ['title', 'content', 'status'],
  },
  milestone: {
    type: 'milestone',
    label: 'Milestone',
    description: 'Een afgerond project of doel',
    icon: 'Trophy',
    color: 'entry-milestone',
    suggestedFields: ['title', 'content', 'custom_date'],
  },
  note: {
    type: 'note',
    label: 'Notitie',
    description: 'Een korte observatie of gedachte',
    icon: 'StickyNote',
    color: 'entry-note',
    suggestedFields: ['title', 'content'],
  },
  resource: {
    type: 'resource',
    label: 'Resource',
    description: 'Een artikel, video of tool',
    icon: 'Link',
    color: 'entry-resource',
    suggestedFields: ['title', 'content', 'status'],
  },
  bookmark: {
    type: 'bookmark',
    label: 'Bookmark',
    description: 'Iets om later mee aan de slag te gaan',
    icon: 'Bookmark',
    color: 'entry-bookmark',
    suggestedFields: ['title', 'content', 'status'],
  },
}

// ─── Tags ───

export interface Tag {
  id: string
  name: string
  color: string // Hex code
  created_at: string
}

export interface EntryTag {
  entry_id: string
  tag_id: string
}

// ─── Entry References ───

export interface EntryReference {
  id: string
  from_entry_id: string
  to_entry_id: string
  created_at: string
}

// ─── Views ───

export type ViewType = 'timeline' | 'list' | 'grid' | 'graph'

// ─── App State ───

export interface AppState {
  currentView: ViewType
  sidebarOpen: boolean
  selectedEntryId: string | null
}

// ─── Toast ───

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}
