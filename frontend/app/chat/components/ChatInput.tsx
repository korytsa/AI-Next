import { Send, X } from 'lucide-react'
import { forwardRef } from 'react'
import { useLanguage } from '@/app/contexts/LanguageContext'

const MAX_MESSAGE_LENGTH = 10000

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  onCancel?: () => void
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ input, setInput, onSubmit, loading, onCancel }, ref) => {
    const { t } = useLanguage()
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value.length <= MAX_MESSAGE_LENGTH) {
        setInput(value)
      }
    }

    const remainingChars = MAX_MESSAGE_LENGTH - input.length
    const isNearLimit = remainingChars < 100

    return (
      <form onSubmit={onSubmit} className="border-t p-4">
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <textarea
              ref={ref}
              value={input}
              onChange={handleInputChange}
              placeholder={t('chat.placeholder')}
              maxLength={MAX_MESSAGE_LENGTH}
              rows={3}
              className="flex-1 px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none overflow-y-auto"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (!loading && input.trim()) {
                    onSubmit(e as any)
                  }
                }
              }}
            />
            {loading && onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                {t('chat.cancel')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t('chat.send')}
              </button>
            )}
          </div>
          {isNearLimit && (
            <p className={`text-xs text-right ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} {t('chat.charactersRemaining')}
            </p>
          )}
        </div>
      </form>
    )
  }
)

ChatInput.displayName = 'ChatInput'
