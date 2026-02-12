'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '@/app/contexts/LanguageContext'

// const validate = (values: { email: string; password: string }) => {
//   const errors: Partial<Record<keyof typeof values, string>> = {}
//   if (!values.email) {
//     errors.email = 'Required'
//   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
//     errors.email = 'Invalid email address'
//   }
//   if (!values.password) {
//     errors.password = 'Required'
//   }
//   return errors
// }

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    // validate,
    onSubmit: async (values) => {
      setError(null)
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) {
          const code = data.error || 'loginFailed'
          setError(t(`auth.errors.${code}`))
          return
        }
        router.push('/chat')
      } catch {
        setError(t('auth.errors.somethingWentWrong'))
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft-xl p-8">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center mb-2">
            {t('auth.welcomeBack')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8">
            {t('auth.signInPrompt')}
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                {t('auth.email')}
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // className={
                //   formik.touched.email && formik.errors.email
                //     ? 'border-red-400 focus:ring-red-400/50'
                //     : ''
                // }
              />
              {/* {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                  {formik.errors.email}
                </p>
              )} */}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                {t('auth.password')}
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // className={
                //   formik.touched.password && formik.errors.password
                //     ? 'border-red-400 focus:ring-red-400/50'
                //     : ''
                // }
              />
              {/* {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                  {formik.errors.password}
                </p>
              )} */}
            </div>

            {error && (
              <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {t('auth.noAccount')}{' '}
              <Link
                href="/register"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t('auth.signUp')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
