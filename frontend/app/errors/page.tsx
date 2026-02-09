'use client'

import { useLanguage } from '@/app/contexts/LanguageContext'
import { useErrors } from './hooks/useErrors'
import { ErrorsHeader } from './components/ErrorsHeader'
import { ErrorsStats } from './components/ErrorsStats'
import { ErrorsList } from './components/ErrorsList'
import { EmptyState } from './components/EmptyState'
import { Loading } from '@/app/components/Loading'

export default function ErrorsPage() {
  const { t } = useLanguage()
  const { errorData, loading, fetchErrors, handleClearErrors, formatDate } = useErrors()

  const handleClear = async () => {
    if (!confirm(t('errorsPage.clearConfirm'))) return
    await handleClearErrors()
  }

  if (loading && !errorData) {
    return <Loading variant="spinner" layout="fullscreen" text={t('errorsPage.loading')} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <ErrorsHeader onRefresh={fetchErrors} onClear={handleClear} />
          {errorData && <ErrorsStats errorData={errorData} />}
        </div>

        {errorData && errorData.errors.length > 0 ? (
          <ErrorsList errors={errorData.errors} formatDate={formatDate} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
