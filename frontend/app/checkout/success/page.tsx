'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '../../components/Button'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { SuspenseFallback } from '@/app/components/SuspenseFallback'

function SuccessContent() {
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const sessionId = searchParams.get('session_id')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">{t('payment.successTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t('payment.successMessage')}{sessionId && ` ${t('payment.successConfirmed')}`}
        </p>
        <Link href="/">
          <Button variant="primary" size="lg" className="w-full">{t('payment.continue')}</Button>
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SuccessContent />
    </Suspense>
  )
}
