import { RefreshCw, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'
import { Button } from '@/app/components/Button'
import { Heading } from '@/app/components/Heading'

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
          <Heading as="h1" size="3xl" weight="bold" color="inherit">{t('errorsPage.title')}</Heading>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="blue" size="md" onClick={onRefresh} className="rounded-lg">
          <RefreshCw className="w-4 h-4" />
          {t('errorsPage.refresh')}
        </Button>
        <Button variant="dangerFilled" size="md" onClick={onClear} className="rounded-lg">
          <Trash2 className="w-4 h-4" />
          {t('errorsPage.clear')}
        </Button>
        <LanguageSwitcher />
      </div>
    </div>
  )
}
