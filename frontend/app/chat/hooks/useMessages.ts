import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'

const STORAGE_KEY = 'ai-chat-history'
const INITIAL_MESSAGES_TO_LOAD = 20
const MESSAGES_PER_LOAD = 20

const DEFAULT_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hello! I am an AI assistant. How can I help you?',
}

const loadMessagesFromStorage = (): Message[] | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error)
  }

  return null
}

const saveMessagesToStorage = (messages: Message[]) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error)
  }
}

export function useMessages() {
  const [allMessages, setAllMessages] = useState<Message[]>([DEFAULT_MESSAGE])
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([DEFAULT_MESSAGE])
  const [hasMoreMessages, setHasMoreMessages] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const isInitialLoad = useRef(true)
  const isHydrated = useRef(false)

  const loadInitialMessages = (messages: Message[]) => {
    if (messages.length <= INITIAL_MESSAGES_TO_LOAD) {
      setDisplayedMessages(messages)
      setHasMoreMessages(false)
    } else {
      const lastMessages = messages.slice(-INITIAL_MESSAGES_TO_LOAD)
      setDisplayedMessages(lastMessages)
      setHasMoreMessages(true)
    }
  }

  const loadMoreMessages = () => {
    if (isLoadingMore || !hasMoreMessages) return

    setIsLoadingMore(true)
    const currentStartIndex = allMessages.length - displayedMessages.length
    const newStartIndex = Math.max(0, currentStartIndex - MESSAGES_PER_LOAD)
    const messagesToAdd = allMessages.slice(newStartIndex, currentStartIndex)
    
    setTimeout(() => {
      setDisplayedMessages([...messagesToAdd, ...displayedMessages])
      setHasMoreMessages(newStartIndex > 0)
      setIsLoadingMore(false)
    }, 100)
  }

  const addMessage = (message: Message) => {
    setAllMessages((prev) => [...prev, message])
    setDisplayedMessages((prev) => [...prev, message])
  }

  const updateLastMessage = (updater: (prev: Message) => Message): Message => {
    const updateMessages = (prev: Message[]) => {
      const newMessages = [...prev]
      const lastIndex = newMessages.length - 1
      if (lastIndex >= 0) {
        newMessages[lastIndex] = updater(newMessages[lastIndex])
      }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated.current) {
      const loadedMessages = loadMessagesFromStorage()
      if (loadedMessages) {
        setAllMessages(loadedMessages)
        loadInitialMessages(loadedMessages)
      }
      isHydrated.current = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated.current) return
    
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    
    saveMessagesToStorage(allMessages)
    loadInitialMessages(allMessages)
  }, [allMessages])

  useEffect(() => {
    if (displayedMessages.length > 0 && displayedMessages[displayedMessages.length - 1].role === 'assistant') {
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
