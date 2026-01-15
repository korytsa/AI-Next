import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'
import { RotateCcw } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  onRetry?: () => void
}

export function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const hasError = !!message.error
  const isRetryable = message.error?.retryable

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
                    Retry after {message.error.retryAfter} seconds
                  </p>
                )}
              </div>
            </div>
            {isRetryable && onRetry && (
              <button
                onClick={onRetry}
                className="mt-2 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retry
              </button>
            )}
          </div>
        ) : message.role === 'assistant' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  )
}
