import { useState, useRef, useEffect } from 'react'
import { useLoading } from '@/app/hooks/useLoading'
import { Message } from '../types'
import { getJsonFromStorage, saveJsonToStorage, removeFromStorage } from '@/app/lib/storage'

const STORAGE_KEY = 'ai-chat-history'
const INITIAL_MESSAGES_TO_LOAD = 20
const MESSAGES_PER_LOAD = 20

const DEFAULT_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hello! I am an AI assistant. How can I help you?',
}


export function useMessages() {
  const [allMessages, setAllMessages] = useState<Message[]>([DEFAULT_MESSAGE])
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([DEFAULT_MESSAGE])
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const { loading: isLoadingMore, setLoading: setIsLoadingMore, run: runLoadMore } = useLoading()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const isInitialLoad = useRef(true)
  const isHydrated = useRef(false)

  const loadInitialMessages = (messages: Message[]) => {
    if (messages.length <= INITIAL_MESSAGES_TO_LOAD) {
      setDisplayedMessages(messages)
      setHasMoreMessages(false)
      return
    }
    setDisplayedMessages(messages.slice(-INITIAL_MESSAGES_TO_LOAD))
    setHasMoreMessages(true)
  }

  const loadMoreMessages = () => {
    if (isLoadingMore || !hasMoreMessages) return

    runLoadMore(async () => {
      const currentStartIndex = allMessages.length - displayedMessages.length
      const newStartIndex = Math.max(0, currentStartIndex - MESSAGES_PER_LOAD)
      const messagesToAdd = allMessages.slice(newStartIndex, currentStartIndex)
      await new Promise((r) => setTimeout(r, 100))
      setDisplayedMessages([...messagesToAdd, ...displayedMessages])
      setHasMoreMessages(newStartIndex > 0)
    })
  }

  const addMessage = (message: Message) => {
    setAllMessages((prev) => [...prev, message])
    setDisplayedMessages((prev) => [...prev, message])
  }

  const updateLastMessage = (updater: (prev: Message) => Message): Message => {
    const updateMessages = (prev: Message[]) => {
      if (prev.length === 0) return prev
      const newMessages = [...prev]
      newMessages[newMessages.length - 1] = updater(newMessages[newMessages.length - 1])
      return newMessages
    }
    setAllMessages(updateMessages)
    setDisplayedMessages(updateMessages)
    
    const lastMessage = allMessages[allMessages.length - 1] || { role: 'assistant' as const, content: '' }
    return updater(lastMessage)
  }

  const clearHistory = () => {
    setAllMessages([DEFAULT_MESSAGE])
    setDisplayedMessages([DEFAULT_MESSAGE])
    setHasMoreMessages(false)
    removeFromStorage(STORAGE_KEY)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (typeof window === 'undefined' || isHydrated.current) return

    const loadedMessages = getJsonFromStorage<Message[]>(STORAGE_KEY, [])
    if (Array.isArray(loadedMessages) && loadedMessages.length > 0) {
      setAllMessages(loadedMessages)
      loadInitialMessages(loadedMessages)
    }
    isHydrated.current = true
  }, [])

  useEffect(() => {
    if (!isHydrated.current || isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    
    saveJsonToStorage(STORAGE_KEY, allMessages)
    loadInitialMessages(allMessages)
  }, [allMessages])

  useEffect(() => {
    if (displayedMessages[displayedMessages.length - 1]?.role === 'assistant') {
      scrollToBottom()
    }
  }, [displayedMessages])

  return {
    allMessages,
    displayedMessages,
    setAllMessages,
    addMessage,
    updateLastMessage,
    clearHistory,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    messagesEndRef,
    messagesStartRef,
    scrollToBottom,
  }
}
