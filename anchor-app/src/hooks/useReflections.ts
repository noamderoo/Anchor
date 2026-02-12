import { useState, useEffect, useCallback } from 'react'
import type { Entry } from '@/types'
import { fetchRandomEntry, fetchAllFlashbacks } from '@/lib/queries/reflections'

// ─── useRandomHighlight ───

export function useRandomHighlight() {
  const [entry, setEntry] = useState<Entry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const randomEntry = await fetchRandomEntry(14) // minimaal 2 weken oud
      setEntry(randomEntry)
    } catch (err) {
      setError((err as Error).message)
      setEntry(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { entry, isLoading, error, refresh }
}

// ─── useFlashbacks ───

export function useFlashbacks() {
  const [flashbacks, setFlashbacks] = useState<{ monthsAgo: number; entries: Entry[] }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const results = await fetchAllFlashbacks(6) // tot 6 maanden terug
        if (!cancelled) {
          setFlashbacks(results)
        }
      } catch (err) {
        if (!cancelled) {
          setError((err as Error).message)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { flashbacks, isLoading, error }
}
