import { useLanguage } from '@/app/contexts/LanguageContext'
import { ErrorData } from '../hooks/useErrors'

interface ErrorsStatsProps {
  errorData: ErrorData
}

export function ErrorsStats({ errorData }: ErrorsStatsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('errorsPage.totalErrors')}</div>
        <div className="text-2xl font-bold">{errorData.total}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('errorsPage.errorTypes')}</div>
        <div className="text-2xl font-bold">{Object.keys(errorData.stats.byType).length}</div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('errorsPage.endpoints')}</div>
        <div className="text-2xl font-bold">{Object.keys(errorData.stats.byEndpoint).length}</div>
      </div>
    </div>
  )
}
