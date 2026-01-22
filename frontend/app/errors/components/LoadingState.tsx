import { RefreshCw } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function LoadingState() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">{t('errorsPage.loading')}</p>
      </div>
    </div>
  )
}
