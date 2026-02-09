import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { Heading } from '@/app/components/Heading'

export function EmptyState() {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center shadow">
      <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <Heading as="h3" size="xl" weight="semibold" className="mb-2 text-gray-900 dark:text-gray-100">
        {t('errorsPage.noErrors')}
      </Heading>
      <p className="text-gray-500 dark:text-gray-400">
        {t('errorsPage.noErrorsDescription')}
      </p>
    </div>
  )
}
