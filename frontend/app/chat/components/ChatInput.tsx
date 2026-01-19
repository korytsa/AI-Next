import { Send } from 'lucide-react'
import { forwardRef } from 'react'

const MAX_MESSAGE_LENGTH = 10000

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ input, setInput, onSubmit, loading }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <div className="flex gap-2">
            <input
              ref={ref}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter a message..."
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 px-4 py-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
          {isNearLimit && (
            <p className={`text-xs text-right ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {remainingChars} characters remaining
            </p>
          )}
        </div>
      </form>
    )
  }
)

ChatInput.displayName = 'ChatInput'
