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
