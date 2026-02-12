import { useState, useEffect, useCallback } from 'react'
import type { Entry, EntryReference } from '@/types'
import * as refsApi from '@/lib/queries/references'

interface UseReferencesReturn {
  outgoing: EntryReference[]
  incoming: EntryReference[]
  isLoading: boolean
  addReference: (toEntryId: string) => Promise<void>
  removeReference: (referenceId: string) => Promise<void>
}

/**
 * Hook voor het beheren van verwijzingen van/naar een entry.
 */
export function useReferences(entryId: string | null): UseReferencesReturn {
  const [outgoing, setOutgoing] = useState<EntryReference[]>([])
  const [incoming, setIncoming] = useState<EntryReference[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load references when entryId changes
  useEffect(() => {
    if (!entryId || entryId === '' || entryId.startsWith('temp-')) {
      setOutgoing([])
      setIncoming([])
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const { outgoing: out, incoming: inc } = await refsApi.fetchReferencesForEntry(entryId!)
        if (!cancelled) {
          setOutgoing(out)
          setIncoming(inc)
        }
      } catch {
        // Fail silently
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [entryId])

  const addReference = useCallback(
    async (toEntryId: string) => {
      if (!entryId || entryId === '') return

      try {
        const ref = await refsApi.createReference(entryId, toEntryId)
        setOutgoing((prev) => [ref, ...prev])
      } catch {
        // Fail silently
      }
    },
    [entryId]
  )

  const removeReference = useCallback(
    async (referenceId: string) => {
      // Optimistic remove
      const previousOutgoing = outgoing
      const previousIncoming = incoming
      setOutgoing((prev) => prev.filter((r) => r.id !== referenceId))
      setIncoming((prev) => prev.filter((r) => r.id !== referenceId))

      try {
        await refsApi.deleteReference(referenceId)
      } catch {
        // Rollback
        setOutgoing(previousOutgoing)
        setIncoming(previousIncoming)
      }
    },
    [outgoing, incoming]
  )

  return { outgoing, incoming, isLoading, addReference, removeReference }
}

/**
 * Hook voor het ophalen van alle references (voor graph view).
 */
export function useAllReferences() {
  const [references, setReferences] = useState<EntryReference[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const data = await refsApi.fetchAllReferences()
        if (!cancelled) setReferences(data)
      } catch {
        // Fail silently
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { references, isLoading }
}

/**
 * Resolve entry titels voor een lijst van reference entry IDs.
 * Returnt een map van entryId -> Entry.
 */
export function useReferencedEntries(
  references: EntryReference[],
  allEntries: Entry[]
): Record<string, Entry | null> {
  const entryMap: Record<string, Entry | null> = {}
  const entryLookup = new Map(allEntries.map((e) => [e.id, e]))

  for (const ref of references) {
    if (!entryMap[ref.to_entry_id]) {
      entryMap[ref.to_entry_id] = entryLookup.get(ref.to_entry_id) || null
    }
    if (!entryMap[ref.from_entry_id]) {
      entryMap[ref.from_entry_id] = entryLookup.get(ref.from_entry_id) || null
    }
  }

  return entryMap
}
