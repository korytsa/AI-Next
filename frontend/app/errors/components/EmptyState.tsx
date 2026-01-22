import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function EmptyState() {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow">
      <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {t('errorsPage.noErrors')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        {t('errorsPage.noErrorsDescription')}
      </p>
    </div>
  )
}
