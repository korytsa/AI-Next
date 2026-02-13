import { useState, useCallback } from 'react'

export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial)

  const run = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await fn()
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, setLoading, run }
}
