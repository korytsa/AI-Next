import { useState, useRef, useEffect } from 'react'
import { Message } from '../types'
import { parseError, ChatError } from '@/app/lib/error-handler'

const STORAGE_KEY = 'ai-chat-history'
const USER_NAME_KEY = 'ai-chat-username'
const RESPONSE_MODE_KEY = 'ai-chat-response-mode'
const CHAIN_OF_THOUGHT_KEY = 'ai-chat-chain-of-thought'

export type ResponseMode = 'short' | 'detailed'
export type ChainOfThoughtMode = 'none' | 'short' | 'detailed'

const DEFAULT_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hello! I am an AI assistant. How can I help you?',
}

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

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([DEFAULT_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [useStreaming, setUseStreaming] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [responseMode, setResponseMode] = useState<ResponseMode>('detailed')
  const [chainOfThought, setChainOfThought] = useState<ChainOfThoughtMode>('none')
  const [totalTokens, setTotalTokens] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const streamingContentRef = useRef<string>('')
  const isInitialLoad = useRef(true)
  const isHydrated = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !isHydrated.current) {
      const loadedMessages = loadMessagesFromStorage()
      if (loadedMessages) {
        setMessages(loadedMessages)
      }
      
      const loadedUserName = loadUserNameFromStorage()
      if (loadedUserName) {
        setUserName(loadedUserName)
      } else {
        setShowNameModal(true)
      }
      
      const loadedResponseMode = loadResponseModeFromStorage()
      setResponseMode(loadedResponseMode)
      
      const loadedChainOfThought = loadChainOfThoughtFromStorage()
      setChainOfThought(loadedChainOfThought)
      
      isHydrated.current = true
    }
  }, [])

  useEffect(() => {
    if (!isHydrated.current) return
    
    if (isInitialLoad.current) {
      isInitialLoad.current = false
      return
    }
    
    saveMessagesToStorage(messages)
  }, [messages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isHydrated.current && !loading && inputRef.current && messages.length > 1) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [loading, messages.length])

  const handleStreamingSubmit = async (messagesToSend: Message[], retryCount = 0): Promise<void> => {
    const MAX_RETRIES = 3
    const assistantMessageIndex = messages.length

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    streamingContentRef.current = ''

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userName: userName,
          responseMode: responseMode,
          chainOfThought: chainOfThought,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const chatError = parseError(errorData, response)
        
        if (chatError.retryable && retryCount < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
          await new Promise(resolve => setTimeout(resolve, delay))
          return handleStreamingSubmit(messagesToSend, retryCount + 1)
        }
        
        throw chatError
      }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No reader available')
    }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setLoading(false)
              continue
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) {
                const chatError = parseError(parsed.error)
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastIndex = newMessages.length - 1
                  if (newMessages[lastIndex]?.role === 'assistant') {
                    newMessages[lastIndex] = {
                      ...newMessages[lastIndex],
                      content: '',
                      error: chatError,
                    }
                  }
                  return newMessages
                })
                setLoading(false)
                return
              }
              
              if (parsed.usage) {
                setTotalTokens((prev) => prev + (parsed.usage.total_tokens || 0))
              }
              
              if (parsed.content) {
                streamingContentRef.current += parsed.content
                setMessages((prev) => {
                  const newMessages = [...prev]
                  const lastIndex = newMessages.length - 1
                  if (newMessages[lastIndex]?.role === 'assistant') {
                    newMessages[lastIndex] = {
                      ...newMessages[lastIndex],
                      content: streamingContentRef.current,
                    }
                  }
                  return newMessages
                })
                scrollToBottom()
              }
            } catch (e) {
            }
          }
        }
      }

      setLoading(false)
    } catch (error: any) {
      const chatError: ChatError = error && typeof error === 'object' && 'type' in error && 'retryable' in error
        ? error as ChatError
        : parseError(error)
      
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastIndex = newMessages.length - 1
        if (newMessages[lastIndex]?.role === 'assistant') {
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: '',
            error: chatError,
          }
        } else {
          newMessages.push({ 
            role: 'assistant', 
            content: '',
            error: chatError,
          })
        }
        return newMessages
      })
      setLoading(false)
      throw chatError
    }
  }

  const handleRegularSubmit = async (messagesToSend: Message[], retryCount = 0): Promise<void> => {
    const MAX_RETRIES = 3

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesToSend.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userName: userName,
          responseMode: responseMode,
          chainOfThought: chainOfThought,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const chatError = parseError(data, response)
        
        if (chatError.retryable && retryCount < MAX_RETRIES) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 10000)
          await new Promise(resolve => setTimeout(resolve, delay))
          return handleRegularSubmit(messagesToSend, retryCount + 1)
        }
        
        throw chatError
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
      
      if (data.usage) {
        setTotalTokens((prev) => prev + (data.usage.total_tokens || 0))
      }
      
      setLoading(false)
    } catch (error: any) {
      const chatError: ChatError = error && typeof error === 'object' && 'type' in error && 'retryable' in error
        ? error as ChatError
        : parseError(error)
      throw chatError
    }
  }

  const handleSetUserName = (name: string) => {
    if (name.trim()) {
      setUserName(name.trim())
      saveUserNameToStorage(name.trim())
      setShowNameModal(false)
    }
  }

  const handleSetResponseMode = (mode: ResponseMode) => {
    setResponseMode(mode)
    saveResponseModeToStorage(mode)
  }

  const handleSetChainOfThought = (mode: ChainOfThoughtMode) => {
    setChainOfThought(mode)
    saveChainOfThoughtToStorage(mode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const messagesToSend = [...messages, userMessage]

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
      
      setMessages((prev) => {
        const newMessages = [...prev]
        const lastMessage = newMessages[newMessages.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = ''
          lastMessage.error = chatError
        } else {
          newMessages.push({ 
            role: 'assistant', 
            content: '',
            error: chatError,
          })
        }
        return newMessages
      })
      setLoading(false)
    }
  }

  const retryLastMessage = async () => {
    if (loading) return
    
    const userMessages: Message[] = []
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userMessages.unshift(messages[i])
        const messagesToRetry = messages.slice(0, i + 1)
        setLoading(true)
        
        try {
          if (useStreaming) {
            await handleStreamingSubmit(messagesToRetry)
          } else {
            await handleRegularSubmit(messagesToRetry)
          }
        } catch (error: any) {
          const chatError: ChatError = error && typeof error === 'object' && 'type' in error && 'retryable' in error
            ? error as ChatError
            : parseError(error)
          
          setMessages((prev) => {
            const newMessages = [...prev]
            const lastIndex = newMessages.length - 1
            if (newMessages[lastIndex]?.role === 'assistant') {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: '',
                error: chatError,
              }
            }
            return newMessages
          })
          setLoading(false)
        }
        break
      }
    }
  }

  const clearHistory = () => {
    setMessages([DEFAULT_MESSAGE])
    setTotalTokens(0)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const exportDialog = () => {
    if (messages.length === 0) return

    const dialogText = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => {
        const role = msg.role === 'user' ? 'You' : 'AI'
        const content = msg.error ? `[Error: ${msg.error.message}]` : msg.content
        return `${role}: ${content}`
      })
      .join('\n\n')

    const blob = new Blob([dialogText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    messages,
    input,
    setInput,
    loading,
    useStreaming,
    setUseStreaming,
    messagesEndRef,
    inputRef,
    handleSubmit,
    clearHistory,
    retryLastMessage,
    userName,
    showNameModal,
    handleSetUserName,
    setShowNameModal,
    responseMode,
    handleSetResponseMode,
    exportDialog,
    totalTokens,
    chainOfThought,
    handleSetChainOfThought,
  }
}
