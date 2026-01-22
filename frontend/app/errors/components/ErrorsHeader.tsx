import { RefreshCw, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

interface ErrorsHeaderProps {
  onRefresh: () => void
  onClear: () => void
}

export function ErrorsHeader({ onRefresh, onClear }: ErrorsHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <Link
          href="/chat"
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          <h1 className="text-3xl font-bold">{t('errorsPage.title')}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('errorsPage.refresh')}
        </button>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          {t('errorsPage.clear')}
        </button>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
