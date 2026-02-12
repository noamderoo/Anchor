import { useState, useCallback, useRef } from 'react'
import * as entriesApi from '@/lib/queries/entries'
import type { Entry } from '@/types'

const BATCH_SIZE = 50

interface UseInfiniteEntriesResult {
  entries: Entry[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: string | null
  loadInitial: () => Promise<void>
  loadMore: () => Promise<void>
  addEntry: (entry: Entry) => void
  updateEntry: (id: string, updated: Entry) => void
  removeEntry: (id: string) => void
}

export function useInfiniteEntries(): UseInfiniteEntriesResult {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const offsetRef = useRef(0)

  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await entriesApi.fetchEntries({ limit: BATCH_SIZE, offset: 0 })
      setEntries(data)
      offsetRef.current = data.length
      setHasMore(data.length >= BATCH_SIZE)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const data = await entriesApi.fetchEntries({ limit: BATCH_SIZE, offset: offsetRef.current })
      setEntries((prev) => {
        // Deduplicate by id
        const existingIds = new Set(prev.map((e) => e.id))
        const newEntries = data.filter((e) => !existingIds.has(e.id))
        return [...prev, ...newEntries]
      })
      offsetRef.current += data.length
      setHasMore(data.length >= BATCH_SIZE)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore])

  const addEntry = useCallback((entry: Entry) => {
    setEntries((prev) => [entry, ...prev])
    offsetRef.current += 1
  }, [])

  const updateEntry = useCallback((id: string, updated: Entry) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    offsetRef.current = Math.max(0, offsetRef.current - 1)
  }, [])

  return {
    entries,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadInitial,
    loadMore,
    addEntry,
    updateEntry,
    removeEntry,
  }
}
