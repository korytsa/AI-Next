import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'
import { RotateCcw } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import React from 'react'

interface MessageBubbleProps {
  message: Message
  onRetry?: () => void
  searchQuery?: string
}

export function MessageBubble({ message, onRetry, searchQuery = '' }: MessageBubbleProps) {
  const { t } = useLanguage()
  const hasError = !!message.error
  const isRetryable = message.error?.retryable

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
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <p>{highlightText(message.content, searchQuery)}</p>
        )}
      </div>
    </div>
  )
}
