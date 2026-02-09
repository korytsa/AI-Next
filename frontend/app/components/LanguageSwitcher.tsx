'use client'

import { useLanguage } from '@/app/contexts/LanguageContext'
import { Globe } from 'lucide-react'
import { Button } from '@/app/components/Button'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ru' : 'en')
  }

  return (
    <Button
      variant="language"
      size="sm"
      onClick={toggleLanguage}
      className="font-medium rounded-md"
      title={language === 'en' ? 'Switch to Russian' : 'Переключить на английский'}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{language}</span>
    </Button>
  )
}
