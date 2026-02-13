import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { suggestTags, type TagSuggestion, type SuggestTagsParams } from '@/lib/ai/tagSuggestions'

interface UseTagSuggestionsOptions {
  title: string
  content: string
  entryType: string
  existingTagNames: string[]
  allTagNames: string[]
  enabled?: boolean
}

interface UseTagSuggestionsResult {
  suggestions: TagSuggestion[]
  isLoading: boolean
  dismiss: (tagName: string) => void
  dismissAll: () => void
}

const DEBOUNCE_MS = 500
const MIN_CHARS = 10
const AUTO_DISMISS_MS = 30_000

export function useTagSuggestions({
  title,
  content,
  entryType,
  existingTagNames,
  allTagNames,
  enabled = true,
}: UseTagSuggestionsOptions): UseTagSuggestionsResult {
  const [suggestions, setSuggestions] = useState<TagSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const lastInputRef = useRef('')

  // Stabilize array deps — join into strings so they don't trigger re-renders
  const existingTagsKey = existingTagNames.join('\0')
  const allTagsKey = allTagNames.join('\0')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableExistingTagNames = useMemo(() => existingTagNames, [existingTagsKey])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableAllTagNames = useMemo(() => allTagNames, [allTagsKey])

  // Clear auto-dismiss timer
  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current)
      dismissTimerRef.current = null
    }
  }, [])

  // Start auto-dismiss timer (30s)
  const startDismissTimer = useCallback(() => {
    clearDismissTimer()
    dismissTimerRef.current = setTimeout(() => {
      setSuggestions([])
    }, AUTO_DISMISS_MS)
  }, [clearDismissTimer])

  // Dismiss a single suggestion
  const dismiss = useCallback((tagName: string) => {
    setSuggestions((prev) => prev.filter((s) => s.name !== tagName))
  }, [])

  // Dismiss all suggestions
  const dismissAll = useCallback(() => {
    setSuggestions([])
    clearDismissTimer()
  }, [clearDismissTimer])

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    async (params: SuggestTagsParams) => {
      // Cancel any in-flight request
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setIsLoading(true)

      try {
        const result = await suggestTags(params)

        // Check if aborted
        if (controller.signal.aborted) return

        // Filter out tags that are already on the entry
        const existingSet = new Set(params.existingTags.map((t) => t.toLowerCase()))
        const filtered = result.suggestions.filter(
          (s) => !existingSet.has(s.name.toLowerCase())
        )

        setSuggestions(filtered)
        if (filtered.length > 0) {
          startDismissTimer()
        }
      } catch {
        // Silently fail — no suggestions shown
        if (!controller.signal.aborted) {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    },
    [startDismissTimer]
  )

  // Watch for input changes and debounce
  useEffect(() => {
    if (!enabled) {
      setSuggestions([])
      return
    }

    const combinedInput = `${title}|${content}`
    const combinedText = `${title} ${content}`.trim()

    // Skip if below minimum length
    if (combinedText.length < MIN_CHARS) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    // Skip if input hasn't meaningfully changed
    if (combinedInput === lastInputRef.current) return
    lastInputRef.current = combinedInput

    // Clear existing suggestions on new input
    clearDismissTimer()

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions({
        title,
        content,
        entryType,
        existingTags: stableExistingTagNames,
        allTags: stableAllTagNames,
      })
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [title, content, entryType, stableExistingTagNames, stableAllTagNames, enabled, fetchSuggestions, clearDismissTimer])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      clearDismissTimer()
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [clearDismissTimer])

  return {
    suggestions,
    isLoading,
    dismiss,
    dismissAll,
  }
}
