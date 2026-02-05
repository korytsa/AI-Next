import { Message } from '../types'
import { createRequestBody, handleError, parseChatError } from './chatApiUtils'
import { ResponseMode, ChainOfThoughtMode } from './useUserSettings'

interface RegularHandlerProps {
  userName?: string | null
  responseMode: ResponseMode
  chainOfThought: ChainOfThoughtMode
  selectedModel: string
  useRAG?: boolean
  ragMaxDocuments?: number
  useCache?: boolean
  addMessage: (message: Message) => void
  setTotalTokens: (updater: (prev: number) => number) => void
  setLoading: (loading: boolean) => void
  abortControllerRef: React.MutableRefObject<AbortController | null>
}

export async function handleRegularSubmit(
  messagesToSend: Message[],
  retryCount: number,
  props: RegularHandlerProps
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
    setTotalTokens,
    setLoading,
    abortControllerRef,
  } = props

  abortControllerRef.current = new AbortController()

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createRequestBody(messagesToSend, userName, responseMode, chainOfThought, selectedModel, useRAG, ragMaxDocuments, useCache)),
      signal: abortControllerRef.current.signal,
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return handleError(data, retryCount, () => handleRegularSubmit(messagesToSend, retryCount + 1, props))
    }

    const assistantMessage: Message = { role: 'assistant', content: data.message }
    addMessage(assistantMessage)
    
    if (data.usage) {
      setTotalTokens((prev) => prev + (data.usage.total_tokens || 0))
    }
    
    setLoading(false)
    abortControllerRef.current = null
  } catch (error: any) {
    if (error.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
      setLoading(false)
      abortControllerRef.current = null
      return
    }
    setLoading(false)
    abortControllerRef.current = null
    throw parseChatError(error)
  }
}
