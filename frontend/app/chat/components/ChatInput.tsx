import { Send } from 'lucide-react'
import { forwardRef } from 'react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ input, setInput, onSubmit, loading }, ref) => {
    return (
      <form onSubmit={onSubmit} className="border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            ref={ref}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a message..."
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
    </form>
  )
  }
)

ChatInput.displayName = 'ChatInput'
