import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { useMessages } from './useMessages'
import { useUserSettings } from './useUserSettings'
import { useChatApi } from './useChatApi'
import { useExport } from './useExport'
import { sanitizeText } from '@/app/lib/sanitization'
import { parseChatError, createErrorMessage } from './chatApiUtils'

export type { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

export function useChat() {
  const [input, setInput] = useState('')
  const [useStreaming, setUseStreaming] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
    allMessages,
    displayedMessages,
    addMessage,
    updateLastMessage,
    clearHistory: clearMessagesHistory,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    messagesEndRef,
    messagesStartRef,
    scrollToBottom,
  } = useMessages()

  const {
    userName,
    handleSetUserName,
    responseMode,
    handleSetResponseMode,
    chainOfThought,
    handleSetChainOfThought,
    selectedModel,
    handleSetSelectedModel,
  } = useUserSettings()

  const {
    loading,
    setLoading,
    totalTokens,
    handleStreamingSubmit,
    handleRegularSubmit,
    retryLastMessage: retryLastMessageApi,
    cancelRequest,
  } = useChatApi({
    allMessages,
    addMessage,
    updateLastMessage,
    userName,
    responseMode,
    chainOfThought,
    selectedModel,
    scrollToBottom,
  })

  const { exportDialog, isExporting } = useExport(allMessages)

  useEffect(() => {
    if (!loading && inputRef.current && displayedMessages.length > 1) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [loading, displayedMessages.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const sanitizedContent = sanitizeText(input, {
      removeHtml: true,
      normalizeWhitespace: true,
      removeControlChars: true,
    })

    const userMessage: Message = { role: 'user', content: sanitizedContent }
    addMessage(userMessage)
    setInput('')
    setLoading(true)

    const messagesToSend = [...allMessages, userMessage]

    try {
      if (useStreaming) {
        await handleStreamingSubmit(messagesToSend)
      } else {
        await handleRegularSubmit(messagesToSend)
      }
    } catch (error: any) {
      const chatError = parseChatError(error)
      updateLastMessage((prev) => createErrorMessage(prev, chatError))
      setLoading(false)
    }
  }


  const clearHistory = () => clearMessagesHistory()

  const retryLastMessage = () => retryLastMessageApi(useStreaming)

  return {
    messages: displayedMessages,
    input,
    setInput,
    loading,
    useStreaming,
    setUseStreaming,
    messagesEndRef,
    messagesStartRef,
    inputRef,
    handleSubmit,
    clearHistory,
    retryLastMessage,
    userName,
    handleSetUserName,
    responseMode,
    handleSetResponseMode,
    exportDialog,
    totalTokens,
    chainOfThought,
    handleSetChainOfThought,
    selectedModel,
    handleSetSelectedModel,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    isExporting,
    cancelRequest,
    searchQuery,
    setSearchQuery,
  }
}
