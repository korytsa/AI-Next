import { useState, useRef } from 'react'
import { useLoading } from '@/app/hooks/useLoading'
import { Message } from '../types'
import { ResponseMode, ChainOfThoughtMode } from './useUserSettings'
import { parseChatError, createErrorMessage } from './chatApiUtils'
import { handleStreamingSubmit } from './streamingHandler'
import { handleRegularSubmit } from './regularHandler'

interface UseChatApiProps {
  allMessages: Message[]
  addMessage: (message: Message) => void
  updateLastMessage: (updater: (prev: Message) => Message) => void
  userName?: string | null
  responseMode: ResponseMode
  chainOfThought: ChainOfThoughtMode
  selectedModel: string
  useRAG?: boolean
  ragMaxDocuments?: number
  useCache?: boolean
  scrollToBottom: () => void
}

export function useChatApi({
  allMessages,
  addMessage,
  updateLastMessage,
  userName,
  responseMode,
  chainOfThought,
    selectedModel,
    useRAG = false,
    ragMaxDocuments = 3,
    useCache = false,
    scrollToBottom,
  }: UseChatApiProps) {
  const { loading, setLoading } = useLoading()
  const [totalTokens, setTotalTokens] = useState(0)
  const streamingContentRef = useRef<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const streamingProps = {
    userName,
    responseMode,
    chainOfThought,
    selectedModel,
    useRAG,
    ragMaxDocuments,
    useCache,
    addMessage,
    updateLastMessage,
    setTotalTokens,
    setLoading,
    scrollToBottom,
    streamingContentRef,
    abortControllerRef,
  }

  const regularProps = {
    userName,
    responseMode,
    chainOfThought,
    selectedModel,
    useRAG,
    ragMaxDocuments,
    useCache,
    addMessage,
    setTotalTokens,
    setLoading,
    abortControllerRef,
  }

  const handleStreaming = async (messagesToSend: Message[], retryCount = 0) => {
    return handleStreamingSubmit(messagesToSend, retryCount, streamingProps)
  }

  const handleRegular = async (messagesToSend: Message[], retryCount = 0) => {
    return handleRegularSubmit(messagesToSend, retryCount, regularProps)
  }

  const cancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
    }
  }

  const retryLastMessage = async (useStreaming: boolean) => {
    if (loading) return
    
    for (let i = allMessages.length - 1; i >= 0; i--) {
      if (allMessages[i].role === 'user') {
        const messagesToRetry = allMessages.slice(0, i + 1)
        setLoading(true)
        
        try {
          if (useStreaming) {
            await handleStreaming(messagesToRetry)
          } else {
            await handleRegular(messagesToRetry)
          }
        } catch (error: any) {
          const chatError = parseChatError(error)
          updateLastMessage((prev) => createErrorMessage(prev, chatError))
          setLoading(false)
        }
        break
      }
    }
  }

  return {
    loading,
    setLoading,
    totalTokens,
    handleStreamingSubmit: handleStreaming,
    handleRegularSubmit: handleRegular,
    retryLastMessage,
    cancelRequest,
  }
}
