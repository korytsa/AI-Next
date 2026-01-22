import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { LoadingIndicator } from './LoadingIndicator'
import { ChevronUp } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface MessagesListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
  messagesStartRef: React.RefObject<HTMLDivElement>
  loading: boolean
  onRetry?: () => void
  onLoadMore?: () => void
  hasMoreMessages?: boolean
  isLoadingMore?: boolean
  searchQuery?: string
}

export function MessagesList({ 
  messages, 
  messagesEndRef, 
  messagesStartRef,
  loading, 
  onRetry,
  onLoadMore,
  hasMoreMessages = false,
  isLoadingMore = false,
  searchQuery = '',
}: MessagesListProps) {
  const { t } = useLanguage()
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
      {hasMoreMessages && (
        <div className="flex justify-center pb-2">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronUp className="w-4 h-4" />
            {isLoadingMore ? t('chat.loading') : t('chat.loadOlderMessages')}
          </button>
        </div>
      )}
      <div ref={messagesStartRef} />
      {messages.map((message, idx) => (
        <MessageBubble 
          key={idx} 
          message={message} 
          onRetry={message.error?.retryable ? onRetry : undefined}
          searchQuery={searchQuery}
        />
      ))}
      {loading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}
