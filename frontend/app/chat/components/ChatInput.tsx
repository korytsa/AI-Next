import { Send, X, Mic, MicOff, FileText } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { usePromptTemplates } from '../hooks/usePromptTemplates'

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
    const { saveTemplate } = usePromptTemplates()
    const [showSaveDialog, setShowSaveDialog] = useState(false)
    const [templateName, setTemplateName] = useState('')
    
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

    const handleSaveTemplate = () => {
      if (!input.trim()) return
      
      const name = templateName.trim() || `Template ${Date.now()}`
      if (saveTemplate(name, input)) {
        setShowSaveDialog(false)
        setTemplateName('')
      }
    }

    const remainingChars = MAX_MESSAGE_LENGTH - input.length
    const isNearLimit = remainingChars < 100

    return (
      <>
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl border border-slate-200/50 dark:border-slate-700/50 p-6 min-w-[400px] max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('templates.saveTemplate')}</h3>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }}
                  className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={t('templates.namePlaceholder')}
                className="w-full px-4 py-3 text-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 shadow-soft"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSaveTemplate()
                  } else if (e.key === 'Escape') {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
                >
                  {t('templates.save')}
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }}
                  className="px-4 py-2.5 text-sm bg-slate-200/80 dark:bg-slate-700/80 rounded-2xl hover:bg-slate-300/80 dark:hover:bg-slate-600/80 transition-all duration-200"
                >
                  {t('chat.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
              <textarea
                ref={ref}
                value={input}
                onChange={handleInputChange}
                placeholder={t('chat.placeholder')}
                maxLength={MAX_MESSAGE_LENGTH}
                rows={3}
                className="w-full px-5 py-3 pr-14 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm resize-none overflow-y-auto shadow-soft transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl transition-all duration-200 shadow-soft ${
                    isListening
                      ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-soft-lg'
                      : 'bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80'
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
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSaveDialog(true)}
                disabled={loading || !input.trim()}
                className="px-4 py-3 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-3xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200"
                title={t('templates.save')}
              >
                <FileText className="w-5 h-5" />
              </button>
              {loading && onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-3xl hover:from-red-600 hover:to-pink-600 flex items-center gap-2 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                  {t('chat.cancel')}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-3xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft-lg hover:shadow-soft-xl transition-all duration-200"
                >
                  <Send className="w-5 h-5" />
                  {t('chat.send')}
                </button>
              )}
            </div>
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
      </>
    )
  }
)

ChatInput.displayName = 'ChatInput'
