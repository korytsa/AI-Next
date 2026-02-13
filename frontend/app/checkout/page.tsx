'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../components/Button'
import { SuspenseFallback } from '@/app/components/SuspenseFallback'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { useLoading } from '@/app/hooks/useLoading'

export default function CheckoutPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const { loading, run } = useLoading()
  const [authChecked, setAuthChecked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (!data.loggedIn) {
          router.replace('/login?redirect=/checkout')
        }
        setAuthChecked(true)
      })
      .catch(() => {
        router.replace('/login?redirect=/checkout')
        setAuthChecked(true)
      })
  }, [router])

  if (!authChecked) {
    return <SuspenseFallback />
  }

  const handleCheckout = () => run(async () => {
    setError(null)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || t('checkout.paymentSetupFailed'))
      return
    }
    if (data.url) window.location.href = data.url
    else setError(t('checkout.noCheckoutUrl'))
  }).catch(() => setError(t('checkout.networkError')))

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8">
        <h1 className="text-xl font-semibold mb-4">{t('checkout.title')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {t('checkout.description')}
        </p>
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
        )}
        <Button
          onClick={handleCheckout}
          disabled={loading}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {loading ? t('checkout.redirecting') : t('checkout.payWithStripe')}
        </Button>
        <p className="mt-4 text-center">
          <Link href="/chat" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('checkout.backToChat')}
          </Link>
        </p>
      </div>
    </div>
  )
}
