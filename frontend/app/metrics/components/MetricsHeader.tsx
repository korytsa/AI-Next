import Link from 'next/link'
import { BarChart3, RefreshCw, Trash2, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

interface MetricsHeaderProps {
  period: 'today' | 'week' | 'month' | 'all'
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'all') => void
  onRefresh: () => void
  onClear: () => void
}

export function MetricsHeader({ period, onPeriodChange, onRefresh, onClear }: MetricsHeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            href="/chat"
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold">{t('metrics.title')}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('metrics.refresh')}
          </button>
          <button
            onClick={onClear}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t('metrics.clear')}
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t('metrics.period')}:</span>
        {(['today', 'week', 'month', 'all'] as const).map((p) => (
          <button
            key={p}
            onClick={() => onPeriodChange(p)}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {t(`metrics.${p}`)}
          </button>
        ))}
      </div>
    </div>
  )
}
