import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { useMessages } from './useMessages'
import { useUserSettings } from './useUserSettings'
import { useChatApi } from './useChatApi'
import { useExportWorker } from './useExportWorker'
import { exportMessages, getFileExtension, getMimeType, ExportFormat } from '@/app/lib/export-formats'
import { sanitizeText } from '@/app/lib/sanitization'
import { parseChatError, createErrorMessage } from './useChatApiHelpers'

export type { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

export function useChat() {
  const [input, setInput] = useState('')
  const [useStreaming, setUseStreaming] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
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

  const retryLastMessage = async () => {
    await retryLastMessageApi(useStreaming)
  }

  const clearHistory = () => {
    clearMessagesHistory()
  }

  const exportDialog = async (format: ExportFormat = 'txt') => {
    if (allMessages.length === 0) return

    try {
      setIsExporting(true)

      if (format === 'pdf') {
        exportMessages(allMessages, format)
        return
      }

      const exportedContent = exportMessages(allMessages, format)
      if (!exportedContent) return

      const blob = new Blob([exportedContent], { type: getMimeType(format) })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export messages:', error)
    } finally {
      setIsExporting(false)
    }
  }

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
