import { useLanguage } from '@/app/contexts/LanguageContext'
import { ErrorEntry } from '../hooks/useErrors'

interface ErrorCardProps {
  error: ErrorEntry
  formatDate: (timestamp: number) => string
  getTypeColor: (type: string) => string
}

export function ErrorCard({ error, formatDate, getTypeColor }: ErrorCardProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow border-l-4 border-red-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(error.type)}`}>
              {error.type}
            </span>
            {error.statusCode && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                {error.statusCode}
              </span>
            )}
            {error.endpoint && (
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700">
                {error.method} {error.endpoint}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {error.message}
          </h3>
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
