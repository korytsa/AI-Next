'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations } from '@/app/lib/translations'
import { getFromStorage, saveToStorage } from '@/app/lib/storage'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const isValidLanguage = (value: string): value is Language => value === 'en' || value === 'ru'
    const saved = getFromStorage('language', 'en' as Language, isValidLanguage)
    
    if (saved === 'en' || saved === 'ru') {
      setLanguageState(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      setLanguageState(browserLang === 'ru' ? 'ru' : 'en')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    saveToStorage('language', lang)
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
