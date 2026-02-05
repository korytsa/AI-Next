'use client'

import { Volume2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

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
        <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.autoPlayVoice')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Auto-read responses</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleAutoPlayVoice}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 shadow-soft ${
              autoPlayVoice ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                autoPlayVoice ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  )
}
