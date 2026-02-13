'use client'

import { useLanguage } from '@/app/contexts/LanguageContext'
import { Loading } from '@/app/components/Loading'

export function SuspenseFallback() {
  const { t } = useLanguage()
  return <Loading variant="spinner" layout="fullscreen" text={t('checkout.loading')} />
}
