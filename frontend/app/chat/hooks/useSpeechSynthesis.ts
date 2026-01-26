import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechSynthesisHook {
  isSpeaking: boolean
  isSupported: boolean
  error: string | null
  speak: (text: string) => void
  stop: () => void
}

let globalSpeakingId: string | null = null
const listeners = new Set<(id: string | null) => void>()

const notifyListeners = (id: string | null) => {
  globalSpeakingId = id
  listeners.forEach(listener => listener(id))
}

const getVoice = (lang: 'en' | 'ru') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null
  const voices = window.speechSynthesis.getVoices()
  const prefix = lang === 'ru' ? 'ru' : 'en'
  return voices.find(v => v.lang.startsWith(prefix)) || voices[0] || null
}

export function useSpeechSynthesis(
  language: 'en' | 'ru' = 'en',
  messageId?: string
): SpeechSynthesisHook {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const messageIdRef = useRef(messageId)

  useEffect(() => {
    messageIdRef.current = messageId
  }, [messageId])

  useEffect(() => {
    const supported = typeof window !== 'undefined' && !!window.speechSynthesis
    setIsSupported(supported)
    if (!supported) {
      setError('Speech synthesis is not supported in your browser')
      return
    }

    const listener = (id: string | null) => {
      setIsSpeaking(id === messageIdRef.current)
    }
    listeners.add(listener)
    setIsSpeaking(globalSpeakingId === messageIdRef.current)
    
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (!isSupported || typeof window === 'undefined') return

    window.speechSynthesis.cancel()

    const cleanText = text
      .replace(/#{1,6}\s+|\*\*|\*|`|\[([^\]]+)\]\([^\)]+\)|\n+/g, (m, p1) => p1 || ' ')
      .replace(/\s+/g, ' ')
      .trim()

    if (!cleanText) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    const voice = getVoice(language)
    
    if (voice) {
      utterance.voice = voice
      utterance.lang = language === 'ru' ? 'ru-RU' : 'en-US'
    }

    utterance.onstart = () => {
      notifyListeners(messageIdRef.current || null)
      setError(null)
    }

    utterance.onend = () => {
      notifyListeners(null)
      utteranceRef.current = null
    }

    utterance.onerror = (e) => {
      setError(`Speech synthesis error: ${e.error}`)
      notifyListeners(null)
      utteranceRef.current = null
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [language, isSupported])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      notifyListeners(null)
      utteranceRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  return {
    isSpeaking,
    isSupported,
    error,
    speak,
    stop,
  }
}
