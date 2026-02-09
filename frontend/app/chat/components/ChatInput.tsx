import { Send, X, Mic, MicOff, FileText } from 'lucide-react'
import { forwardRef, useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { usePromptTemplates } from '../hooks/usePromptTemplates'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { TextArea } from '@/app/components/TextArea'
import { Modal } from '@/app/components/Modal'
import { Flex } from '@/app/components/Flex'
import { Box } from '@/app/components/Box'

const MAX_MESSAGE_LENGTH = 10000

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (message: string) => void
  loading: boolean
  onCancel?: () => void
}

export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ input, setInput, onSubmit, loading, onCancel }, ref) => {
    const { t, language } = useLanguage()
    const { saveTemplate } = usePromptTemplates()
    const [showSaveDialog, setShowSaveDialog] = useState(false)

    const chatFormik = useFormik({
      initialValues: { message: input },
      enableReinitialize: true,
      onSubmit: (values) => {
        if (isListening) stopListening()
        const text = (values.message ?? '').trim()
        if (!text || loading) return
        onSubmit(text)
        chatFormik.resetForm({ values: { message: '' } })
      },
    })
    const { values: chatValues, setFieldValue, handleSubmit, handleChange, resetForm: resetChatForm } = chatFormik
    const messageValue = chatValues.message ?? ''
    const messageRef = useRef(messageValue)
    messageRef.current = messageValue

    const saveTemplateFormik = useFormik({
      initialValues: { templateName: '' },
      onSubmit: (values) => {
        const message = messageValue.trim()
        if (!message) return
        const name = (values.templateName ?? '').trim() || `Template ${Date.now()}`
        if (saveTemplate(name, message)) {
          saveTemplateFormik.resetForm()
          setShowSaveDialog(false)
        }
      },
    })
    const { values: templateValues, handleChange: handleTemplateChange, handleSubmit: handleSaveTemplateSubmit, resetForm: resetSaveTemplate } = saveTemplateFormik

    const {
      isListening,
      isSupported,
      error: voiceError,
      startListening,
      stopListening,
      transcript,
    } = useSpeechRecognition(
      (text: string) => {
        const current = messageRef.current
        const newText = current ? `${current} ${text}`.trim() : text
        if (newText.length <= MAX_MESSAGE_LENGTH) {
          setFieldValue('message', newText)
        }
      },
      language
    )

    useEffect(() => {
      setInput(messageValue)
    }, [messageValue, setInput])

    const handleVoiceToggle = () => {
      if (isListening) stopListening()
      else startListening()
    }

    const openSaveModal = () => {
      resetSaveTemplate()
      setShowSaveDialog(true)
    }

    const closeSaveModal = () => {
      setShowSaveDialog(false)
      resetSaveTemplate()
    }

    const remainingChars = MAX_MESSAGE_LENGTH - messageValue.length
    const isNearLimit = remainingChars < 100
    const messageTrimmed = messageValue.trim()

    return (
      <>
        <Modal open={showSaveDialog} onClose={closeSaveModal} title={t('templates.saveTemplate')}>
          <form onSubmit={handleSaveTemplateSubmit}>
            <Input
              type="text"
              name="templateName"
              value={templateValues.templateName}
              onChange={handleTemplateChange}
              placeholder={t('templates.namePlaceholder')}
              size="md"
              className="mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  saveTemplateFormik.handleSubmit()
                } else if (e.key === 'Escape') {
                  closeSaveModal()
                }
              }}
            />
            <Flex gap={3}>
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1 py-2.5 shadow-soft hover:shadow-soft-lg"
              >
                {t('templates.save')}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={closeSaveModal}
                className="py-2.5"
              >
                {t('chat.cancel')}
              </Button>
            </Flex>
          </form>
        </Modal>

        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6"
        >
          <Flex direction="col" gap={3} className="max-w-4xl mx-auto">
            <Flex gap={3} align="end">
              <Box className="flex-1 relative">
                <TextArea
                  ref={ref}
                  name="message"
                  value={messageValue}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= MAX_MESSAGE_LENGTH) {
                      handleChange(e)
                    }
                  }}
                  placeholder={t('chat.placeholder')}
                  maxLength={MAX_MESSAGE_LENGTH}
                  rows={3}
                  className="pr-14"
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (!loading && messageTrimmed) {
                        if (isListening) stopListening()
                        handleSubmit(e as any)
                      }
                    }
                  }}
                />
                {isSupported && (
                  <Button
                    type="button"
                    variant={isListening ? 'dangerGradient' : 'secondary'}
                    size="iconMd"
                    onClick={handleVoiceToggle}
                    disabled={loading}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 shadow-soft ${isListening ? 'shadow-soft-lg' : ''}`}
                    title={isListening ? t('chat.stopListening') : t('chat.startListening')}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                )}
              </Box>
              <Flex direction="col" gap={2} className="shrink-0">
                <Button
                type="button"
                variant="success"
                size="lg"
                onClick={openSaveModal}
                disabled={loading || !messageTrimmed}
                title={t('templates.save')}
              >
                <FileText className="w-5 h-5" />
              </Button>
              {loading && onCancel ? (
                <Button
                  type="button"
                  variant="dangerGradient"
                  size="lg"
                  onClick={onCancel}
                >
                  <X className="w-5 h-5" />
                  {t('chat.cancel')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading || !messageTrimmed}
                >
                  <Send className="w-5 h-5" />
                  {t('chat.send')}
                </Button>
              )}
              </Flex>
            </Flex>
          </Flex>
          {isListening && (
            <Flex direction="col" gap={1}>
              <Flex align="center" gap={2} className="text-sm text-blue-600 dark:text-blue-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span>{t('chat.listening')}</span>
              </Flex>
              {transcript && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                  {transcript}
                </div>
              )}
            </Flex>
          )}
          {voiceError && (
            <div className="text-sm text-red-500 dark:text-red-400">{voiceError}</div>
          )}
          {isNearLimit && (
            <p
              className={`text-xs text-right ${remainingChars < 0 ? 'text-red-500' : 'text-gray-500'}`}
            >
              {remainingChars} {t('chat.charactersRemaining')}
            </p>
          )}
        </form>
    </>
  )
  }
)

ChatInput.displayName = 'ChatInput'
