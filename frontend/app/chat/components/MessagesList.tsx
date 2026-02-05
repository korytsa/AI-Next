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
  autoPlayVoice?: boolean
  useStreaming?: boolean
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
  autoPlayVoice = false,
  useStreaming = true,
}: MessagesListProps) {
  const { t } = useLanguage()
  
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-2 relative">
      {hasMoreMessages && (
        <div className="flex justify-center pb-2">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-5 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
          >
            <ChevronUp className="w-4 h-4" />
            {isLoadingMore ? t('chat.loading') : t('chat.loadOlderMessages')}
          </button>
        </div>
      )}
      <div ref={messagesStartRef} />
      {messages.map((message, idx) => {
        const isLast = idx === messages.length - 1
        // For streaming: wait until loading is false. For regular: message is complete when it exists
        const isComplete = useStreaming ? (!loading && isLast) : isLast
        return (
        <MessageBubble 
          key={idx} 
          message={message} 
          onRetry={message.error?.retryable ? onRetry : undefined}
          searchQuery={searchQuery}
            autoPlayVoice={autoPlayVoice}
            isLastMessage={isComplete}
            isLoading={loading && isLast}
        />
        )
      })}
      {loading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}
