import { useState, useEffect, useRef } from 'react'
import { DEFAULT_MODEL_ID } from '@/app/lib/models'
import { getFromStorage, saveToStorage, getJsonFromStorage, saveJsonToStorage } from '@/app/lib/storage'

const STORAGE_KEYS = {
  userName: 'ai-chat-username',
  responseMode: 'ai-chat-response-mode',
  chainOfThought: 'ai-chat-chain-of-thought',
  selectedModel: 'ai-chat-selected-model',
  autoPlayVoice: 'ai-chat-auto-play-voice',
  useRAG: 'ai-chat-use-rag',
} as const

export type ResponseMode = 'short' | 'detailed'
export type ChainOfThoughtMode = 'none' | 'short' | 'detailed'

export function useUserSettings() {
  const DEFAULT_USER_NAME = 'user'
  const [userName, setUserName] = useState<string>(DEFAULT_USER_NAME)
  const [responseMode, setResponseMode] = useState<ResponseMode>('detailed')
  const [chainOfThought, setChainOfThought] = useState<ChainOfThoughtMode>('none')
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID)
  const [autoPlayVoice, setAutoPlayVoice] = useState<boolean>(false)
  const [useRAG, setUseRAG] = useState<boolean>(false)
  const isHydrated = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || isHydrated.current) return

    const loadedUserName = getFromStorage(STORAGE_KEYS.userName, DEFAULT_USER_NAME)
    if (loadedUserName) {
      setUserName(loadedUserName)
    } else {
      setUserName(DEFAULT_USER_NAME)
      saveToStorage(STORAGE_KEYS.userName, DEFAULT_USER_NAME)
    }

    const isValidResponseMode = (value: string) => value === 'short' || value === 'detailed'
    setResponseMode(getFromStorage(STORAGE_KEYS.responseMode, 'detailed' as ResponseMode, isValidResponseMode))

    const isValidChainOfThought = (value: string) => value === 'none' || value === 'short' || value === 'detailed'
    setChainOfThought(getFromStorage(STORAGE_KEYS.chainOfThought, 'none' as ChainOfThoughtMode, isValidChainOfThought))

    setSelectedModel(getFromStorage(STORAGE_KEYS.selectedModel, DEFAULT_MODEL_ID))

    const loadedAutoPlayVoice = getJsonFromStorage(STORAGE_KEYS.autoPlayVoice, false)
    setAutoPlayVoice(loadedAutoPlayVoice)

    const loadedUseRAG = getJsonFromStorage(STORAGE_KEYS.useRAG, false)
    setUseRAG(loadedUseRAG)

    isHydrated.current = true
  }, [])

  const handleSetUserName = (name: string) => {
    const trimmedName = name.trim() || DEFAULT_USER_NAME
    setUserName(trimmedName)
    saveToStorage(STORAGE_KEYS.userName, trimmedName)
  }

  const handleSetResponseMode = (mode: ResponseMode) => {
    setResponseMode(mode)
    saveToStorage(STORAGE_KEYS.responseMode, mode)
  }

  const handleSetChainOfThought = (mode: ChainOfThoughtMode) => {
    setChainOfThought(mode)
    saveToStorage(STORAGE_KEYS.chainOfThought, mode)
  }

  const handleSetSelectedModel = (model: string) => {
    setSelectedModel(model)
    saveToStorage(STORAGE_KEYS.selectedModel, model)
  }

  const handleSetAutoPlayVoice = (enabled: boolean) => {
    setAutoPlayVoice(enabled)
    saveJsonToStorage(STORAGE_KEYS.autoPlayVoice, enabled)
  }

  const handleSetUseRAG = (enabled: boolean) => {
    setUseRAG(enabled)
    saveJsonToStorage(STORAGE_KEYS.useRAG, enabled)
  }

  return {
    userName,
    handleSetUserName,
    responseMode,
    handleSetResponseMode,
    chainOfThought,
    handleSetChainOfThought,
    selectedModel,
    handleSetSelectedModel,
    autoPlayVoice,
    handleSetAutoPlayVoice,
    useRAG,
    handleSetUseRAG,
  }
}
