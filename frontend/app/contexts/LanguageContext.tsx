'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getFromStorage, saveToStorage } from '@/app/lib/storage'
import i18n from '@/app/lib/i18n'

export type Language = 'en' | 'ru'

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

    let resolved: Language
    if (saved === 'en' || saved === 'ru') {
      resolved = saved
    } else {
      const browserLang = navigator.language.split('-')[0]
      resolved = browserLang === 'ru' ? 'ru' : 'en'
    }

    setLanguageState(resolved)
    i18n.changeLanguage(resolved).catch(() => {
    })
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    i18n.changeLanguage(lang).catch(() => {
    })
    saveToStorage('language', lang)
  }

  const t = (key: string): string => {
    const value = i18n.t(key)
    return typeof value === 'string' && value.length > 0 ? value : key
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

