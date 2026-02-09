'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseFetchOptions extends RequestInit {
  refetchInterval?: number
  enabled?: boolean
}

export interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
  setData: (data: T | null | ((prev: T | null) => T | null)) => void
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchResult<T> {
  const { refetchInterval, enabled = true, ...requestInit } = options
  const requestInitRef = useRef(requestInit)
  requestInitRef.current = requestInit

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchJson<T>(url, requestInitRef.current)
      setData(result)
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    refetch()
  }, [url, enabled, refetch])

  useEffect(() => {
    if (!enabled || refetchInterval == null || refetchInterval <= 0) return
    const interval = setInterval(refetch, refetchInterval)
    return () => clearInterval(interval)
  }, [enabled, refetchInterval, refetch])

  return { data, loading, error, refetch, setData }
}

export interface UseFetchMutationResult {
  execute: (url: string, init?: RequestInit) => Promise<Response | null>
  loading: boolean
  error: Error | null
  resetError: () => void
}

export function useFetchMutation(): UseFetchMutationResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async (url: string, init?: RequestInit): Promise<Response | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(url, init)
      return response
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const resetError = useCallback(() => setError(null), [])

  return { execute, loading, error, resetError }
}
