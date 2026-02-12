import { supabase } from '@/lib/supabase'
import type { Tag } from '@/types'

// ─── Read ───

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw new Error(`Tags ophalen mislukt: ${error.message}`)
  return data || []
}

export async function fetchTagsForEntry(entryId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('entry_tags')
    .select('tag_id, tags(*)')
    .eq('entry_id', entryId)

  if (error) throw new Error(`Entry tags ophalen mislukt: ${error.message}`)

  // Extract tag objects from the join
  return (data || []).map((row: Record<string, unknown>) => row.tags as unknown as Tag)
}

export async function fetchTagsForEntries(entryIds: string[]): Promise<Record<string, Tag[]>> {
  if (entryIds.length === 0) return {}

  const { data, error } = await supabase
    .from('entry_tags')
    .select('entry_id, tag_id, tags(*)')
    .in('entry_id', entryIds)

  if (error) throw new Error(`Entry tags ophalen mislukt: ${error.message}`)

  const map: Record<string, Tag[]> = {}
  for (const row of data || []) {
    const r = row as unknown as { entry_id: string; tags: Tag }
    if (!map[r.entry_id]) map[r.entry_id] = []
    map[r.entry_id].push(r.tags)
  }
  return map
}

// ─── Create ───

export async function createTag(name: string, color: string): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .insert({ name: name.trim().toLowerCase(), color })
    .select()
    .single()

  if (error) throw new Error(`Tag aanmaken mislukt: ${error.message}`)
  return data
}

// ─── Update ───

export async function updateTag(id: string, updates: Partial<Pick<Tag, 'name' | 'color'>>): Promise<Tag> {
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Tag bijwerken mislukt: ${error.message}`)
  return data
}

// ─── Delete ───

export async function deleteTag(id: string): Promise<void> {
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Tag verwijderen mislukt: ${error.message}`)
}

// ─── Link / Unlink ───

export async function linkTagToEntry(entryId: string, tagId: string): Promise<void> {
  const { error } = await supabase
    .from('entry_tags')
    .insert({ entry_id: entryId, tag_id: tagId })

  if (error) {
    // Ignore duplicate key errors (already linked)
    if (error.code === '23505') return
    throw new Error(`Tag koppelen mislukt: ${error.message}`)
  }
}

export async function unlinkTagFromEntry(entryId: string, tagId: string): Promise<void> {
  const { error } = await supabase
    .from('entry_tags')
    .delete()
    .eq('entry_id', entryId)
    .eq('tag_id', tagId)

  if (error) throw new Error(`Tag ontkoppelen mislukt: ${error.message}`)
}
