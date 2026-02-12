import { supabase } from '@/lib/supabase'
import type { EntryReference } from '@/types'

// ─── Read ───

/**
 * Haal alle verwijzingen op vanuit een entry (uitgaand).
 */
export async function fetchReferencesFrom(entryId: string): Promise<EntryReference[]> {
  const { data, error } = await supabase
    .from('entry_references')
    .select('*')
    .eq('from_entry_id', entryId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Verwijzingen ophalen mislukt: ${error.message}`)
  return data || []
}

/**
 * Haal alle verwijzingen op naar een entry (inkomend).
 */
export async function fetchReferencesTo(entryId: string): Promise<EntryReference[]> {
  const { data, error } = await supabase
    .from('entry_references')
    .select('*')
    .eq('to_entry_id', entryId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Inkomende verwijzingen ophalen mislukt: ${error.message}`)
  return data || []
}

/**
 * Haal alle verwijzingen op voor een entry (zowel in als uit).
 */
export async function fetchReferencesForEntry(
  entryId: string
): Promise<{ outgoing: EntryReference[]; incoming: EntryReference[] }> {
  const [outgoing, incoming] = await Promise.all([
    fetchReferencesFrom(entryId),
    fetchReferencesTo(entryId),
  ])
  return { outgoing, incoming }
}

/**
 * Haal alle verwijzingen op in het systeem.
 */
export async function fetchAllReferences(): Promise<EntryReference[]> {
  const { data, error } = await supabase
    .from('entry_references')
    .select('*')

  if (error) throw new Error(`Alle verwijzingen ophalen mislukt: ${error.message}`)
  return data || []
}

// ─── Create ───

export async function createReference(
  fromEntryId: string,
  toEntryId: string
): Promise<EntryReference> {
  const { data, error } = await supabase
    .from('entry_references')
    .insert({ from_entry_id: fromEntryId, to_entry_id: toEntryId })
    .select()
    .single()

  if (error) {
    // Ignore duplicate references
    if (error.code === '23505') {
      // Return existing reference
      const { data: existing } = await supabase
        .from('entry_references')
        .select('*')
        .eq('from_entry_id', fromEntryId)
        .eq('to_entry_id', toEntryId)
        .single()
      if (existing) return existing
    }
    throw new Error(`Verwijzing aanmaken mislukt: ${error.message}`)
  }
  return data
}

// ─── Delete ───

export async function deleteReference(id: string): Promise<void> {
  const { error } = await supabase
    .from('entry_references')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Verwijzing verwijderen mislukt: ${error.message}`)
}

export async function deleteReferenceBetween(
  fromEntryId: string,
  toEntryId: string
): Promise<void> {
  const { error } = await supabase
    .from('entry_references')
    .delete()
    .eq('from_entry_id', fromEntryId)
    .eq('to_entry_id', toEntryId)

  if (error) throw new Error(`Verwijzing verwijderen mislukt: ${error.message}`)
}
