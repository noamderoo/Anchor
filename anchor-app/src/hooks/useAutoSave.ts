import { useCallback, useRef, useEffect } from 'react'
import type { EntryUpdate } from '@/types'

interface UseAutoSaveOptions {
  onSave: (updates: EntryUpdate) => Promise<void>
  delay?: number
  enabled?: boolean
}

export function useAutoSave({ onSave, delay = 3000, enabled = true }: UseAutoSaveOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingRef = useRef<EntryUpdate | null>(null)
  const isSavingRef = useRef(false)

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const flush = useCallback(async () => {
    cancel()
    if (pendingRef.current && !isSavingRef.current) {
      isSavingRef.current = true
      const updates = { ...pendingRef.current }
      pendingRef.current = null
      try {
        await onSave(updates)
      } finally {
        isSavingRef.current = false
      }
    }
  }, [onSave, cancel])

  const schedule = useCallback(
    (updates: EntryUpdate) => {
      if (!enabled) return
      pendingRef.current = { ...pendingRef.current, ...updates }
      cancel()
      timeoutRef.current = setTimeout(flush, delay)
    },
    [enabled, delay, cancel, flush]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return { schedule, flush, cancel, hasPending: () => pendingRef.current !== null }
}
