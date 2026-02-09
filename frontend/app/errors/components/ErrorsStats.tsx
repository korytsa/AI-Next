import { useLanguage } from '@/app/contexts/LanguageContext'
import { StatCard } from '@/app/components/StatCard'
import { ErrorData } from '../hooks/useErrors'

interface ErrorsStatsProps {
  errorData: ErrorData
}

export function ErrorsStats({ errorData }: ErrorsStatsProps) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <StatCard
        label={t('errorsPage.totalErrors')}
        value={errorData.total}
        size="lg"
        rounded="xl"
      />
      <StatCard
        label={t('errorsPage.errorTypes')}
        value={Object.keys(errorData.stats.byType).length}
        size="lg"
        rounded="xl"
      />
      <StatCard
        label={t('errorsPage.endpoints')}
        value={Object.keys(errorData.stats.byEndpoint).length}
        size="lg"
        rounded="xl"
      />
    </div>
  )
}
