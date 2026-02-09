'use client'

import { Volume2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { SettingsSwitchCard } from '@/app/components/SettingsSwitchCard'

interface VoiceSettingsTabProps {
  autoPlayVoice?: boolean
  onToggleAutoPlayVoice?: () => void
  loading: boolean
}

export function VoiceSettingsTab({
  autoPlayVoice = false,
  onToggleAutoPlayVoice,
  loading,
}: VoiceSettingsTabProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {onToggleAutoPlayVoice && (
        <SettingsSwitchCard
          icon={Volume2}
          iconClassName="text-indigo-500"
          title={t('settings.autoPlayVoice')}
          description="Auto-read responses"
          checked={autoPlayVoice}
          onCheckedChange={onToggleAutoPlayVoice}
          disabled={loading}
          switchSize="md"
          switchVariant="primary"
        />
      )}
    </div>
  )
}
