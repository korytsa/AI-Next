'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '../components/Button'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { Check } from 'lucide-react'

export default function PricingPage() {
  const { t } = useLanguage()
  const PLANS = [
    {
      id: 'free',
      name: t('pricing.free'),
      price: '$0',
      period: t('pricing.forever'),
      features: [t('pricing.features.free1'), t('pricing.features.free2'), t('pricing.features.free3')],
      cta: t('pricing.currentPlan'),
      href: null,
      highlighted: false,
    },
    {
      id: 'pro',
      name: t('pricing.pro'),
      price: '$9.99',
      period: t('pricing.oneTime'),
      features: [t('pricing.features.pro1'), t('pricing.features.pro2'), t('pricing.features.pro3'), t('pricing.features.pro4'), t('pricing.features.pro5')],
      cta: t('pricing.getPro'),
      href: '/checkout',
      highlighted: true,
    },
  ]
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.loggedIn))
      .catch(() => setIsLoggedIn(false))
  }, [])

  const handleGetPro = () => {
    if (!isLoggedIn) {
      router.push('/login?redirect=/checkout')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="max-w-4xl mx-auto pt-12 pb-16">
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-3">
          {t('pricing.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-12">
          {t('pricing.subtitle')}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl border-2 p-8 ${
                plan.highlighted
                  ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/30 dark:bg-indigo-900/10'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1">
                {plan.name}
              </h2>
              <div className="mb-6">
                <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.href ? (
                <Button
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  size="lg"
                  className="w-full"
                  onClick={handleGetPro}
                >
                  {plan.cta}
                </Button>
              ) : (
                <div className="py-3 text-center text-slate-500 dark:text-slate-400 text-sm">
                  {plan.cta}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center">
          <Link href="/chat" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            {t('pricing.backToChat')}
          </Link>
        </p>
      </div>
    </div>
  )
}
