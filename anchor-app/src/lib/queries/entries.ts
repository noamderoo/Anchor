import { supabase } from '@/lib/supabase'
import type { Entry, NewEntry, EntryUpdate } from '@/types'

// ─── Create ───

export async function createEntry(entry: NewEntry): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .insert(entry)
    .select()
    .single()

  if (error) throw new Error(`Entry aanmaken mislukt: ${error.message}`)
  return data
}

// ─── Read ───

export async function fetchEntries(options?: {
  archived?: boolean
  limit?: number
  offset?: number
}): Promise<Entry[]> {
  const { archived = false, limit = 50, offset = 0 } = options || {}

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('archived', archived)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(`Entries ophalen mislukt: ${error.message}`)
  return data || []
}

export async function fetchEntryById(id: string): Promise<Entry | null> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(`Entry ophalen mislukt: ${error.message}`)
  }
  return data
}

// ─── Update ───

export async function updateEntry(id: string, updates: EntryUpdate): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Entry bijwerken mislukt: ${error.message}`)
  return data
}

// ─── Archive ───

export async function archiveEntry(id: string): Promise<Entry> {
  return updateEntry(id, { archived: true })
}

export async function unarchiveEntry(id: string): Promise<Entry> {
  return updateEntry(id, { archived: false })
}

// ─── Delete ───

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Entry verwijderen mislukt: ${error.message}`)
}
