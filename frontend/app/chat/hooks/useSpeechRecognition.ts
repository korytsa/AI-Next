import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechRecognitionHook {
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  transcript: string
}

const ERROR_MESSAGES: Record<string, string> = {
  'no-speech': 'No speech detected. Please try again.',
  'audio-capture': 'No microphone found. Please check your microphone.',
  'not-allowed': 'Microphone permission denied. Please allow microphone access.',
  'network': 'Network error. Please check your connection.',
}

export function useSpeechRecognition(
  onResult: (text: string) => void,
  language: 'en' | 'ru' = 'en'
): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser')
      return
    }

    setIsSupported(true)
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language === 'ru' ? 'ru-RU' : 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalText += text + ' '
        } else {
          interimText += text
        }
      }

      if (finalText) {
        const trimmed = finalText.trim()
        setTranscript(trimmed)
        onResult(trimmed)
      } else if (interimText) {
        setTranscript(interimText)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(ERROR_MESSAGES[event.error] || `Speech recognition error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition

    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [onResult, language])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    
    try {
      recognitionRef.current.lang = language === 'ru' ? 'ru-RU' : 'en-US'
      recognitionRef.current.start()
    } catch {
      setError('Failed to start speech recognition')
    }
  }, [isListening, language])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    transcript,
  }
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface SpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  onstart: (() => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResult[]
}

interface SpeechRecognitionResult {
  [index: number]: { transcript: string; confidence: number }
  isFinal: boolean
}

interface SpeechRecognitionErrorEvent {
  error: string
}
