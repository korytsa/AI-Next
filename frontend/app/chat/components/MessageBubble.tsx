import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'
import { RotateCcw, Square } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis'
import React, { useEffect, useRef } from 'react'

interface MessageBubbleProps {
  message: Message
  onRetry?: () => void
  searchQuery?: string
  autoPlayVoice?: boolean
  isLastMessage?: boolean
  isLoading?: boolean
}

export function MessageBubble({ message, onRetry, searchQuery = '', autoPlayVoice = false, isLastMessage = false, isLoading = false }: MessageBubbleProps) {
  const { t, language } = useLanguage()
  const hasError = !!message.error
  const isRetryable = message.error?.retryable
  const messageId = message.role === 'assistant' ? message.content : undefined
  const { isSpeaking, isSupported, speak, stop } = useSpeechSynthesis(language, messageId)
  const hasAutoPlayedRef = useRef(false)
  const lastContentRef = useRef('')
  const stabilizationTimerRef = useRef<NodeJS.Timeout | null>(null)
  const prevAutoPlayVoiceRef = useRef(autoPlayVoice)
  const autoPlayEnabledAtRef = useRef<string | null>(null)

  // Track when autoPlayVoice changes from false to true
  useEffect(() => {
    const wasDisabled = !prevAutoPlayVoiceRef.current
    const isNowEnabled = autoPlayVoice
    
    if (wasDisabled && isNowEnabled) {
      // Auto-play was just enabled - store current message content to mark it as "seen"
      // Only if there's a complete existing message
      if (message.role === 'assistant' && message.content.trim() && !isLoading && isLastMessage) {
        autoPlayEnabledAtRef.current = message.content
      } else {
        // No existing message, so new messages should play
        autoPlayEnabledAtRef.current = null
      }
    }
    
    prevAutoPlayVoiceRef.current = autoPlayVoice
  }, [autoPlayVoice, message.role, message.content, isLoading, isLastMessage])

  // Auto-play voice for new assistant messages when they're complete
  useEffect(() => {
    // Clear any pending timer
    if (stabilizationTimerRef.current) {
      clearTimeout(stabilizationTimerRef.current)
      stabilizationTimerRef.current = null
    }

    // Check if this is a new message (different from when auto-play was enabled)
    const isNewMessage = !autoPlayEnabledAtRef.current || message.content !== autoPlayEnabledAtRef.current
    const isContentChanged = message.content !== lastContentRef.current
    const isFirstMessage = lastContentRef.current === ''
    
    // Only auto-play if:
    // 1. Auto-play is enabled
    // 2. This is the last message
    // 3. Message is complete (not loading)
    // 4. It's an assistant message
    // 5. No errors
    // 6. Not already played
    // 7. Speech synthesis is supported
    // 8. Content is not empty
    // 9. Content has changed (for streaming) OR it's the first message
    // 10. This message appeared AFTER auto-play was enabled
    const shouldAutoPlay = 
      autoPlayVoice &&
      isLastMessage &&
      !isLoading &&
      message.role === 'assistant' &&
      !hasError &&
      !hasAutoPlayedRef.current &&
      isSupported &&
      message.content.trim().length > 0 &&
      (isContentChanged || isFirstMessage) &&
      isNewMessage

    if (shouldAutoPlay) {
      // For streaming: wait until content stabilizes (no changes for 1 second)
      // For regular: play immediately after a short delay
      stabilizationTimerRef.current = setTimeout(() => {
        // Double-check conditions before playing
        if (
          autoPlayVoice &&
          isLastMessage &&
          !isLoading &&
          message.role === 'assistant' &&
          !hasError &&
          !hasAutoPlayedRef.current &&
          isSupported &&
          message.content.trim().length > 0
        ) {
          hasAutoPlayedRef.current = true
          lastContentRef.current = message.content
          speak(message.content)
        }
      }, isLoading ? 1000 : 500)

      return () => {
        if (stabilizationTimerRef.current) {
          clearTimeout(stabilizationTimerRef.current)
          stabilizationTimerRef.current = null
        }
      }
    }

    // Update last content reference
    if (isContentChanged) {
      lastContentRef.current = message.content
    }
  }, [autoPlayVoice, isLastMessage, isLoading, message.role, message.content, hasError, isSupported, speak])

  // Reset auto-play flag when a new message arrives
  useEffect(() => {
    // When content changes significantly (new message), reset the played flag
    if (message.content && message.content !== lastContentRef.current && message.role === 'assistant') {
      // Only reset if it's a completely different message (not just streaming update)
      const contentLengthDiff = Math.abs(message.content.length - lastContentRef.current.length)
      if (contentLengthDiff > 10 || lastContentRef.current === '') {
        hasAutoPlayedRef.current = false
      }
    }
  }, [message.content, message.role])

  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text
    
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedQuery})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50">
            {part}
          </mark>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  const markdownComponents = searchQuery.trim() ? {
    text: ({ children }: any) => (typeof children === 'string' ? highlightText(children, searchQuery) : children),
  } : undefined

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : hasError
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-gray-100 dark:bg-gray-800'
        }`}
      >
        {hasError && message.error ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <p className="text-red-600 dark:text-red-400 font-medium">
                  {message.error.message}
                </p>
                {message.error.retryAfter && (
                  <p className="text-sm text-red-500 dark:text-red-500 mt-1">
                    {t('chat.retryAfter')} {message.error.retryAfter} {t('chat.seconds')}
                  </p>
                )}
                {message.error && (message.error.type === 'validation_error' || message.error.type === 'moderation_error') && message.error.details && message.error.details.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-red-500 dark:text-red-500 font-medium">{t('chat.details')}</p>
                    <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                      {message.error.details.map((detail: string, index: number) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {isRetryable && onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t('chat.retry')}
              </button>
            )}
          </div>
        ) : message.role === 'assistant' ? (
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
            </div>
            {isSpeaking && isSupported && !hasError && (
              <button
                onClick={stop}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={t('chat.stopVoice')}
              >
                <Square className="w-4 h-4 text-red-600 dark:text-red-400" />
              </button>
            )}
          </div>
        ) : (
          <p>{highlightText(message.content, searchQuery)}</p>
        )}
      </div>
    </div>
  )
}
