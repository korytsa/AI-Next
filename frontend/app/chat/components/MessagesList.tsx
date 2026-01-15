import { Message } from '../types'
import { MessageBubble } from './MessageBubble'
import { LoadingIndicator } from './LoadingIndicator'

interface MessagesListProps {
  messages: Message[]
  messagesEndRef: React.RefObject<HTMLDivElement>
  loading: boolean
  onRetry?: () => void
}

export function MessagesList({ messages, messagesEndRef, loading, onRetry }: MessagesListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, idx) => (
        <MessageBubble 
          key={idx} 
          message={message} 
          onRetry={message.error?.retryable ? onRetry : undefined}
        />
      ))}
      {loading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}
