'use client'

import { Zap, Sparkles, Database } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../../hooks/useChat'
import { AVAILABLE_MODELS } from '@/app/lib/models'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { Select } from '@/app/components/Select'
import { SettingsSwitchCard } from '@/app/components/SettingsSwitchCard'
import { ToggleButtonGroup } from '@/app/components/ToggleButtonGroup'

interface AISettingsTabProps {
  selectedModel: string
  onSetSelectedModel: (model: string) => void
  responseMode: ResponseMode
  onSetResponseMode: (mode: ResponseMode) => void
  chainOfThought: ChainOfThoughtMode
  onSetChainOfThought: (mode: ChainOfThoughtMode) => void
  useStreaming: boolean
  onToggleStreaming: () => void
  useRAG?: boolean
  onToggleUseRAG?: () => void
  useCache?: boolean
  onToggleUseCache?: () => void
  loading: boolean
}

export function AISettingsTab({
  selectedModel,
  onSetSelectedModel,
  responseMode,
  onSetResponseMode,
  chainOfThought,
  onSetChainOfThought,
  useStreaming,
  onToggleStreaming,
    useRAG = false,
    onToggleUseRAG,
    useCache = false,
    onToggleUseCache,
    loading,
}: AISettingsTabProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {t('settings.model')}
        </label>
        <Select
          value={selectedModel}
          onChange={(e) => onSetSelectedModel(e.target.value)}
          disabled={loading}
          size="md"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </Select>
      </div>

      <ToggleButtonGroup<ResponseMode>
        label={t('settings.responseMode')}
        value={responseMode}
        onChange={onSetResponseMode}
        options={[
          { value: 'short', label: t('settings.short') },
          { value: 'detailed', label: t('settings.detailed') },
        ]}
        disabled={loading}
        size="md"
        buttonClassName="flex-1 py-3"
      />

      <ToggleButtonGroup<ChainOfThoughtMode>
        label={t('settings.chainOfThought')}
        value={chainOfThought}
        onChange={onSetChainOfThought}
        options={[
          { value: 'none', label: t('settings.none') },
          { value: 'short', label: t('settings.basic') },
          { value: 'detailed', label: t('settings.advanced') },
        ]}
        disabled={loading}
        size="md"
        buttonClassName="flex-1 py-3"
      />

      <SettingsSwitchCard
        icon={Zap}
        iconClassName="text-indigo-500"
        title={t('settings.streaming')}
        description="Real-time responses"
        checked={useStreaming}
        onCheckedChange={onToggleStreaming}
        disabled={loading}
        switchSize="md"
        switchVariant="primary"
      />

      {onToggleUseRAG && (
        <SettingsSwitchCard
          icon={Sparkles}
          iconClassName="text-purple-500"
          title="RAG"
          description="Knowledge base search"
          checked={useRAG}
          onCheckedChange={onToggleUseRAG}
          disabled={loading}
          switchSize="md"
          switchVariant="purple"
        />
      )}

      {onToggleUseCache && (
        <SettingsSwitchCard
          icon={Database}
          iconClassName="text-green-500"
          title={t('settings.cache')}
          description={t('settings.cacheDescription')}
          checked={useCache}
          onCheckedChange={onToggleUseCache}
          disabled={loading}
          switchSize="md"
          switchVariant="success"
        />
      )}
    </div>
  )
}
