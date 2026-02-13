import { useState, useEffect, useRef } from 'react'

/**
 * Debounced search hook.
 * Returns the debounced value after `delay` ms of inactivity.
 */
export function useSearch(value: string, delay = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [value, delay])

  return debouncedValue
}
