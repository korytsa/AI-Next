import { useState, useEffect, useRef } from 'react'

const USER_NAME_KEY = 'ai-chat-username'
const RESPONSE_MODE_KEY = 'ai-chat-response-mode'
const CHAIN_OF_THOUGHT_KEY = 'ai-chat-chain-of-thought'

export type ResponseMode = 'short' | 'detailed'
export type ChainOfThoughtMode = 'none' | 'short' | 'detailed'

const loadUserNameFromStorage = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(USER_NAME_KEY)
    return stored || null
  } catch (error) {
    console.error('Failed to load username from localStorage:', error)
    return null
  }
}

const saveUserNameToStorage = (name: string) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(USER_NAME_KEY, name)
  } catch (error) {
    console.error('Failed to save username to localStorage:', error)
  }
}

const loadResponseModeFromStorage = (): ResponseMode => {
  if (typeof window === 'undefined') {
    return 'detailed'
  }

  try {
    const stored = localStorage.getItem(RESPONSE_MODE_KEY)
    if (stored === 'short' || stored === 'detailed') {
      return stored
    }
  } catch (error) {
    console.error('Failed to load response mode from localStorage:', error)
  }

  return 'detailed'
}

const saveResponseModeToStorage = (mode: ResponseMode) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(RESPONSE_MODE_KEY, mode)
  } catch (error) {
    console.error('Failed to save response mode to localStorage:', error)
  }
}

const loadChainOfThoughtFromStorage = (): ChainOfThoughtMode => {
  if (typeof window === 'undefined') {
    return 'none'
  }

  try {
    const stored = localStorage.getItem(CHAIN_OF_THOUGHT_KEY)
    if (stored === 'none' || stored === 'short' || stored === 'detailed') {
      return stored
    }
  } catch (error) {
    console.error('Failed to load chain of thought from localStorage:', error)
  }

  return 'none'
}

const saveChainOfThoughtToStorage = (mode: ChainOfThoughtMode) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CHAIN_OF_THOUGHT_KEY, mode)
  } catch (error) {
    console.error('Failed to save chain of thought to localStorage:', error)
  }
}

export function useUserSettings() {
  const DEFAULT_USER_NAME = 'user'
  const [userName, setUserName] = useState<string>(DEFAULT_USER_NAME)
  const [responseMode, setResponseMode] = useState<ResponseMode>('detailed')
  const [chainOfThought, setChainOfThought] = useState<ChainOfThoughtMode>('none')
  const isHydrated = useRef(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated.current) {
      const loadedUserName = loadUserNameFromStorage()
      if (loadedUserName) {
        setUserName(loadedUserName)
      } else {
        setUserName(DEFAULT_USER_NAME)
        saveUserNameToStorage(DEFAULT_USER_NAME)
      }
      
      const loadedResponseMode = loadResponseModeFromStorage()
      setResponseMode(loadedResponseMode)
      
      const loadedChainOfThought = loadChainOfThoughtFromStorage()
      setChainOfThought(loadedChainOfThought)
      
      isHydrated.current = true
    }
  }, [])

  const handleSetUserName = (name: string) => {
    const trimmedName = name.trim() || DEFAULT_USER_NAME
    setUserName(trimmedName)
    saveUserNameToStorage(trimmedName)
  }

  const handleSetResponseMode = (mode: ResponseMode) => {
    setResponseMode(mode)
    saveResponseModeToStorage(mode)
  }

  const handleSetChainOfThought = (mode: ChainOfThoughtMode) => {
    setChainOfThought(mode)
    saveChainOfThoughtToStorage(mode)
  }

  return {
    userName,
    handleSetUserName,
    responseMode,
    handleSetResponseMode,
    chainOfThought,
    handleSetChainOfThought,
  }
}
