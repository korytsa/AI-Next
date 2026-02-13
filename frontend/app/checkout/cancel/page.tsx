'use client'

import Link from 'next/link'
import { Button } from '../../components/Button'
import { useLanguage } from '@/app/contexts/LanguageContext'

export default function CancelPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">{t('payment.cancelledTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t('payment.cancelledMessage')}
        </p>
        <div className="space-y-2">
          <Link href="/checkout">
            <Button variant="primary" size="lg" className="w-full">{t('payment.tryAgain')}</Button>
          </Link>
          <Link href="/">
            <Button variant="secondary" size="lg" className="w-full">{t('payment.backToHome')}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
