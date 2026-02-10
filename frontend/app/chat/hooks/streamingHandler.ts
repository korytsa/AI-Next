import { Message } from '../types'
import { createRequestBody, handleError, parseChatError, createErrorMessage } from './chatApiUtils'
import { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

interface StreamingHandlerProps {
  userName?: string | null
  responseMode: ResponseMode
  chainOfThought: ChainOfThoughtMode
  selectedModel: string
  useRAG?: boolean
  ragMaxDocuments?: number
  useCache?: boolean
  addMessage: (message: Message) => void
  updateLastMessage: (updater: (prev: Message) => Message) => void
  setTotalTokens: (updater: (prev: number) => number) => void
  setLoading: (loading: boolean) => void
  scrollToBottom: () => void
  streamingContentRef: React.MutableRefObject<string>
  abortControllerRef: React.MutableRefObject<AbortController | null>
}

export async function handleStreamingSubmit(
  messagesToSend: Message[],
  retryCount: number,
  props: StreamingHandlerProps
): Promise<void> {
  const {
    userName,
    responseMode,
    chainOfThought,
    selectedModel,
    useRAG = false,
    ragMaxDocuments = 3,
    useCache = false,
    addMessage,
    updateLastMessage,
    setTotalTokens,
    setLoading,
    scrollToBottom,
    streamingContentRef,
    abortControllerRef,
  } = props

  const assistantMessage: Message = { role: 'assistant', content: '' }
  addMessage(assistantMessage)
  streamingContentRef.current = ''
  abortControllerRef.current = new AbortController()

  try {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createRequestBody(messagesToSend, userName, responseMode, chainOfThought, selectedModel, useRAG, ragMaxDocuments, useCache)),
      signal: abortControllerRef.current.signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return handleError(errorData, retryCount, () => handleStreamingSubmit(messagesToSend, retryCount + 1, props))
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No reader available')
    }

    let buffer = ''

    try {
      while (true) {
        if (abortControllerRef.current?.signal.aborted) {
          reader.cancel()
          break
        }

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
                const chatError = parseChatError(parsed.error)
                updateLastMessage((prev) => createErrorMessage(prev, chatError))
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
              console.warn('Failed to parse streaming data:', e)
            }
          }
        }
      }
    } catch (readError) {
      if ((readError as any).name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        reader.cancel()
      } else {
        throw readError
      }
    } finally {
      if (abortControllerRef.current?.signal.aborted) {
        updateLastMessage((prev) => ({
          ...prev,
          content: prev.content || streamingContentRef.current || '[Request cancelled]',
        }))
      }
    }

    setLoading(false)
    abortControllerRef.current = null
  } catch (error: any) {
    if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
      updateLastMessage((prev) => ({
        ...prev,
        content: prev.content || '[Request cancelled]',
      }))
      setLoading(false)
      abortControllerRef.current = null
      return
    }

    const chatError = parseChatError(error)
    updateLastMessage((prev) => createErrorMessage(prev, chatError))
    setLoading(false)
    abortControllerRef.current = null
    throw chatError
  }
}
