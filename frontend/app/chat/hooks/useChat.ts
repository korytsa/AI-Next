import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { parseError, ChatError } from '@/app/lib/error-handler'
import { useMessages } from './useMessages'
import { useUserSettings } from './useUserSettings'
import { useChatApi } from './useChatApi'
import { useExportWorker } from './useExportWorker'
import { sanitizeText } from '@/app/lib/sanitization'

export type { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

export function useChat() {
  const [input, setInput] = useState('')
  const [useStreaming, setUseStreaming] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
    scrollToBottom,
  })

  const { exportMessages: exportMessagesWorker } = useExportWorker()

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
      const chatError: ChatError = error && typeof error === 'object' && 'type' in error && 'retryable' in error
        ? error as ChatError
        : parseError(error)
      
      updateLastMessage((prev) => {
        if (prev.role === 'assistant') {
          return {
            ...prev,
            content: '',
            error: chatError,
          }
        }
        return {
          role: 'assistant',
          content: '',
          error: chatError,
        }
      })
      setLoading(false)
    }
  }

  const retryLastMessage = async () => {
    await retryLastMessageApi(useStreaming)
  }

  const clearHistory = () => {
    clearMessagesHistory()
  }

  const exportDialog = async () => {
    if (allMessages.length === 0) return

    try {
      setIsExporting(true)
      const dialogText = await exportMessagesWorker(allMessages)

      const blob = new Blob([dialogText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`
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
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    isExporting,
    cancelRequest,
  }
}
