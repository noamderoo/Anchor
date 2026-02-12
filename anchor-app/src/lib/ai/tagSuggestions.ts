import { supabase } from '@/lib/supabase'

// ─── Types ───

export interface TagSuggestion {
  name: string
  confidence: number // 0-1 score
}

export interface SuggestTagsParams {
  title: string
  content: string
  entryType: string
  existingTags: string[] // names of tags already on the entry
  allTags: string[]      // all tag names in the system
}

export interface SuggestTagsResult {
  suggestions: TagSuggestion[]
}

// ─── Rate Limiting ───

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

let requestTimestamps: number[] = []

function isRateLimited(): boolean {
  const now = Date.now()
  // Remove timestamps outside the window
  requestTimestamps = requestTimestamps.filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  )
  return requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW
}

function recordRequest(): void {
  requestTimestamps.push(Date.now())
}

// ─── API Call ───

export async function suggestTags(params: SuggestTagsParams): Promise<SuggestTagsResult> {
  // Check rate limit
  if (isRateLimited()) {
    console.warn('[AI Tags] Rate limit bereikt, even wachten...')
    return { suggestions: [] }
  }

  // Validate minimum content
  const combinedText = `${params.title} ${params.content}`.trim()
  if (combinedText.length < 10) {
    return { suggestions: [] }
  }

  recordRequest()

  try {
    const { data, error } = await supabase.functions.invoke('suggest-tags', {
      body: {
        title: params.title,
        content: params.content,
        entry_type: params.entryType,
        existing_tags: params.existingTags,
        all_tags: params.allTags,
      },
    })

    if (error) {
      console.error('[AI Tags] Edge function error:', error)
      return { suggestions: [] }
    }

    // Validate response shape
    if (!data || !Array.isArray(data.suggestions)) {
      console.error('[AI Tags] Ongeldig response formaat:', data)
      return { suggestions: [] }
    }

    // Ensure max 5 suggestions
    const suggestions: TagSuggestion[] = data.suggestions
      .slice(0, 5)
      .map((s: { name?: string; confidence?: number }) => ({
        name: String(s.name || '').trim().toLowerCase(),
        confidence: typeof s.confidence === 'number' ? s.confidence : 0.5,
      }))
      .filter((s: TagSuggestion) => s.name.length > 0)

    return { suggestions }
  } catch (err) {
    console.error('[AI Tags] Request mislukt:', err)
    return { suggestions: [] }
  }
}
