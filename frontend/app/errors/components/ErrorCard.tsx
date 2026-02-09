import { useLanguage } from '@/app/contexts/LanguageContext'
import { ErrorEntry } from '../hooks/useErrors'
import { Heading } from '@/app/components/Heading'
import { Badge } from '@/app/components/Badge'

interface ErrorCardProps {
  error: ErrorEntry
  formatDate: (timestamp: number) => string
}

export function ErrorCard({ error, formatDate }: ErrorCardProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border-l-4 border-red-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={error.type}>{error.type}</Badge>
            {error.statusCode && (
              <Badge variant="neutral">{error.statusCode}</Badge>
            )}
            {error.endpoint && (
              <Badge variant="neutral">{error.method} {error.endpoint}</Badge>
            )}
          </div>
          <Heading as="h3" size="lg" weight="semibold" className="mb-2 text-gray-900 dark:text-gray-100">
            {error.message}
          </Heading>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(error.timestamp)}
          </p>
        </div>
      </div>

      {error.stack && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            {t('errorsPage.stackTrace')}
          </summary>
          <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
            {error.stack}
          </pre>
        </details>
      )}

      {error.context && Object.keys(error.context).length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            {t('errorsPage.context')}
          </summary>
          <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900 rounded text-xs overflow-x-auto">
            {JSON.stringify(error.context, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
