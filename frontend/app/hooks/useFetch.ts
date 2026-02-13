'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useLoading } from './useLoading'

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
  const { loading, setLoading, run } = useLoading(enabled)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(() => run(async () => {
    setError(null)
    const result = await fetchJson<T>(url, requestInitRef.current)
    setData(result)
  }).catch((e) => setError(e instanceof Error ? e : new Error(String(e)))), [url, run])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    refetch()
  }, [url, enabled, refetch, setLoading])

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
  const { loading, run } = useLoading()
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback((url: string, init?: RequestInit): Promise<Response | null> => run(async () => {
    setError(null)
    const response = await fetch(url, init)
    return response
  }).catch((e) => {
    setError(e instanceof Error ? e : new Error(String(e)))
    return null
  }), [run])

  const resetError = useCallback(() => setError(null), [])

  return { execute, loading, error, resetError }
}
