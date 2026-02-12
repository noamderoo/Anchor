import { supabase } from '@/lib/supabase'
import type { Entry } from '@/types'

// ─── Random Highlight ───

/**
 * Haal een willekeurige entry op die minimaal `minAgeDays` dagen oud is.
 * Gebruikt een random ordering in Supabase.
 */
export async function fetchRandomEntry(minAgeDays = 14): Promise<Entry | null> {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - minAgeDays)

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('archived', false)
    .lt('created_at', cutoffDate.toISOString())
    .limit(50) // fetch a pool and pick random client-side for true randomness

  if (error) throw new Error(`Random entry ophalen mislukt: ${error.message}`)
  if (!data || data.length === 0) return null

  // Pick a random entry from the pool
  const randomIndex = Math.floor(Math.random() * data.length)
  return data[randomIndex]
}

// ─── Flashbacks (entries van X maanden geleden) ───

/**
 * Haal entries op die precies `monthsAgo` maanden geleden zijn aangemaakt (±2 dagen).
 */
export async function fetchFlashbackEntries(monthsAgo: number): Promise<Entry[]> {
  const targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() - monthsAgo)

  // Window: ±2 dagen rond de target datum
  const startDate = new Date(targetDate)
  startDate.setDate(startDate.getDate() - 2)
  const endDate = new Date(targetDate)
  endDate.setDate(endDate.getDate() + 2)

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('archived', false)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) throw new Error(`Flashback entries ophalen mislukt: ${error.message}`)
  return data || []
}

/**
 * Haal flashbacks op voor meerdere maandstappen (1, 2, 3, ... maanden geleden).
 * Retourneert alleen maandstappen die daadwerkelijk entries hebben.
 */
export async function fetchAllFlashbacks(
  maxMonths = 12
): Promise<{ monthsAgo: number; entries: Entry[] }[]> {
  const results: { monthsAgo: number; entries: Entry[] }[] = []

  for (let m = 1; m <= maxMonths; m++) {
    const entries = await fetchFlashbackEntries(m)
    if (entries.length > 0) {
      results.push({ monthsAgo: m, entries })
    }
  }

  return results
}
