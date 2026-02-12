'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { useLanguage } from '@/app/contexts/LanguageContext'

interface RegisterValues {
  nickname: string
  email: string
  password: string
  confirmPassword: string
}

// const validate = (values: RegisterValues) => {
//   const errors: Partial<Record<keyof RegisterValues, string>> = {}
//   if (!values.email) {
//     errors.email = 'Required'
//   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
//     errors.email = 'Invalid email address'
//   }
//   if (!values.password) {
//     errors.password = 'Required'
//   } else if (values.password.length < 6) {
//     errors.password = 'Password must be at least 6 characters'
//   }
//   if (!values.confirmPassword) {
//     errors.confirmPassword = 'Required'
//   } else if (values.password !== values.confirmPassword) {
//     errors.confirmPassword = 'Passwords must match'
//   }
//   return errors
// }

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik<RegisterValues>({
    initialValues: { nickname: '', email: '', password: '', confirmPassword: '' },
    // validate,
    onSubmit: async (values) => {
      setError(null)
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: values.nickname,
            email: values.email,
            password: values.password,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          const code = data.error || 'registrationFailed'
          setError(t(`auth.errors.${code}`))
          return
        }
        router.push('/login')
      } catch {
        setError(t('auth.errors.somethingWentWrong'))
      }
    },
  })

  // const fieldError = (name: keyof RegisterValues) =>
  //   formik.touched[name] && formik.errors[name]
  //     ? 'border-red-400 focus:ring-red-400/50'
  //     : ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-soft-xl p-8">
          <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 text-center mb-2">
            {t('auth.createAccount')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-8">
            {t('auth.signUpPrompt')}
          </p>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                {t('auth.nickname')}
              </label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder={t('auth.nicknamePlaceholder')}
                autoComplete="username"
                value={formik.values.nickname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
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
                // className={fieldError('email')}
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
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // className={fieldError('password')}
              />
              {/* {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                  {formik.errors.password}
                </p>
              )} */}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2"
              >
                {t('auth.confirmPassword')}
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // className={fieldError('confirmPassword')}
              />
              {/* {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">
                    {formik.errors.confirmPassword}
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
              {formik.isSubmitting ? t('auth.signingUp') : t('auth.signUp')}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                  or
                </span>
              </div>
            </div>

            <a href="/api/auth/google" className="block mt-8">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {t('auth.signInWithGoogle')}
              </Button>
            </a>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              {t('auth.haveAccount')}{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t('auth.signIn')}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
