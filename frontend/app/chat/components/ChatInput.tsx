import { Send, X, Mic, MicOff } from 'lucide-react'
import { forwardRef, useEffect } from 'react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

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
    const { t, language } = useLanguage()
    
    const {
      isListening,
      isSupported,
      error: voiceError,
      startListening,
      stopListening,
      transcript,
    } = useSpeechRecognition(
      (text: string) => {
        const newText = input ? `${input} ${text}` : text
        if (newText.length <= MAX_MESSAGE_LENGTH) {
          setInput(newText)
        }
      },
      language
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value.length <= MAX_MESSAGE_LENGTH) {
        setInput(value)
      }
    }

    const handleVoiceToggle = () => {
      if (isListening) {
        stopListening()
      } else {
        startListening()
      }
    }

    const handleSubmit = (e: React.FormEvent) => {
      if (isListening) {
        stopListening()
      }
      onSubmit(e)
    }

    const remainingChars = MAX_MESSAGE_LENGTH - input.length
    const isNearLimit = remainingChars < 100

    return (
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex flex-col gap-2 max-w-4xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={ref}
                value={input}
                onChange={handleInputChange}
                placeholder={t('chat.placeholder')}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={3}
                className="w-full px-4 py-2 pr-12 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 resize-none overflow-y-auto"
                disabled={loading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (!loading && input.trim()) {
                      if (isListening) {
                        stopListening()
                      }
                      onSubmit(e as any)
                    }
                  }
                }}
              />
              {isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={loading}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isListening ? t('chat.stopListening') : t('chat.startListening')}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
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
          {isListening && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>{t('chat.listening')}</span>
              </div>
              {transcript && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {transcript}
                </div>
              )}
            </div>
          )}
          {voiceError && (
            <div className="text-sm text-red-500 dark:text-red-400">
              {voiceError}
            </div>
          )}
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
