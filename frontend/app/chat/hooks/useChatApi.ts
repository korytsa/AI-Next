import { useState, useRef } from 'react'
import { Message } from '../types'
import { parseError, ChatError } from '@/app/lib/error-handler'
import { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

interface UseChatApiProps {
  allMessages: Message[]
  addMessage: (message: Message) => void
  updateLastMessage: (updater: (prev: Message) => Message) => void
  userName?: string | null
  responseMode: ResponseMode
  chainOfThought: ChainOfThoughtMode
  scrollToBottom: () => void
}

export function useChatApi({
  allMessages,
  addMessage,
  updateLastMessage,
  userName,
  responseMode,
  chainOfThought,
  scrollToBottom,
}: UseChatApiProps) {
  const [loading, setLoading] = useState(false)
  const [totalTokens, setTotalTokens] = useState(0)
  const streamingContentRef = useRef<string>('')

  const handleStreamingSubmit = async (messagesToSend: Message[], retryCount = 0): Promise<void> => {
    const MAX_RETRIES = 3
    const assistantMessage: Message = { role: 'assistant', content: '' }
    
    addMessage(assistantMessage)
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
                updateLastMessage((prev) => ({
                  ...prev,
                  content: '',
                  error: chatError,
                }))
                setLoading(false)
                return
              }
              
              if (parsed.usage) {
                setTotalTokens((prev) => prev + (parsed.usage.total_tokens || 0))
              }
              
              if (parsed.content) {
                streamingContentRef.current += parsed.content
                updateLastMessage((prev) => ({
                  ...prev,
                  content: streamingContentRef.current,
                }))
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
      
      updateLastMessage((prev) => {
        if (prev.role === 'assistant') {
          return {
            ...prev,
            content: '',
            error: chatError,
          }
        }
        return prev
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

      const assistantMessage: Message = { role: 'assistant', content: data.message }
      addMessage(assistantMessage)
      
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

  const retryLastMessage = async (useStreaming: boolean) => {
    if (loading) return
    
    for (let i = allMessages.length - 1; i >= 0; i--) {
      if (allMessages[i].role === 'user') {
        const messagesToRetry = allMessages.slice(0, i + 1)
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
          
          updateLastMessage((prev) => ({
            ...prev,
            content: '',
            error: chatError,
          }))
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
    handleStreamingSubmit,
    handleRegularSubmit,
    retryLastMessage,
  }
}
