import { Download, BarChart3, FileText, FileCode, FileJson, FileType } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Select } from '@/app/components/Select'
import { Switch } from '@/app/components/Switch'
import { Dropdown } from '@/app/components/Dropdown'
import { ToggleButtonGroup } from '@/app/components/ToggleButtonGroup'
import { useState } from 'react'
import { ExportFormat } from '@/app/lib/export-formats'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { AVAILABLE_MODELS } from '@/app/lib/models'
import Link from 'next/link'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { PromptTemplates } from './PromptTemplates'

interface ChatSettingsPanelProps {
  useStreaming: boolean
  onToggleStreaming: () => void
  loading: boolean
  responseMode: ResponseMode
  onSetResponseMode: (mode: ResponseMode) => void
  chainOfThought: ChainOfThoughtMode
  onSetChainOfThought: (mode: ChainOfThoughtMode) => void
  selectedModel: string
  onSetSelectedModel: (model: string) => void
  autoPlayVoice?: boolean
  onToggleAutoPlayVoice?: () => void
  useRAG?: boolean
  onToggleUseRAG?: () => void
  onExportDialog?: (format: ExportFormat) => void
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
}

export function ChatSettingsPanel({
  useStreaming,
  onToggleStreaming,
  loading,
  responseMode,
  onSetResponseMode,
  chainOfThought,
  onSetChainOfThought,
  selectedModel,
  onSetSelectedModel,
  autoPlayVoice = false,
  onToggleAutoPlayVoice,
  useRAG = false,
  onToggleUseRAG,
  onExportDialog,
  isExporting = false,
  currentInput = '',
  onSelectTemplate,
}: ChatSettingsPanelProps) {
  const { t } = useLanguage()
  const [showExportMenu, setShowExportMenu] = useState(false)

  const handleExport = (format: ExportFormat) => {
    setShowExportMenu(false)
    onExportDialog?.(format)
  }

  const formatIcons = {
    txt: FileText,
    markdown: FileCode,
    json: FileJson,
    pdf: FileType,
  }
  
  return (
    <div className="border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-500">{t('settings.model')}:</label>
          <Select
            value={selectedModel}
            onChange={(e) => onSetSelectedModel(e.target.value)}
            disabled={loading}
            size="sm"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </Select>
        </div>
        <ToggleButtonGroup<ResponseMode>
          layout="inline"
          label={`${t('settings.responseMode')}:`}
          value={responseMode}
          onChange={onSetResponseMode}
          options={[
            { value: 'short', label: t('settings.short') },
            { value: 'detailed', label: t('settings.detailed') },
          ]}
          disabled={loading}
          size="sm"
          buttonClassName={(i) => (i === 0 ? 'rounded-2xl' : 'px-2 py-1 rounded-lg')}
        />
        <ToggleButtonGroup<ChainOfThoughtMode>
          layout="inline"
          label={`${t('settings.chainOfThought')}:`}
          value={chainOfThought}
          onChange={onSetChainOfThought}
          options={[
            { value: 'none', label: t('settings.none') },
            { value: 'short', label: t('settings.basic') },
            { value: 'detailed', label: t('settings.advanced') },
          ]}
          disabled={loading}
          size="sm"
          buttonClassName={(i) => (i === 0 ? 'rounded-2xl' : 'px-2 py-1 rounded-lg')}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.streaming')}:</span>
            <Switch
              checked={useStreaming}
              onCheckedChange={onToggleStreaming}
              disabled={loading}
              size="md"
              variant="primary"
            />
        </div>
        {onToggleAutoPlayVoice && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.autoPlayVoice')}:</span>
            <Switch
              checked={autoPlayVoice}
              onCheckedChange={onToggleAutoPlayVoice}
              disabled={loading}
              size="sm"
              variant="blue"
              offVariant="gray"
            />
          </div>
        )}
        {onToggleUseRAG && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">RAG:</span>
            <Switch
              checked={useRAG}
              onCheckedChange={onToggleUseRAG}
              disabled={loading}
              size="sm"
              variant="blue"
              offVariant="gray"
            />
          </div>
        )}
        {onExportDialog && (
          <Dropdown
            open={showExportMenu && !isExporting}
            onOpenChange={setShowExportMenu}
            trigger={
              <Button
                type="button"
                variant="primaryGhost"
                size="md"
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={loading || isExporting}
                className="py-2.5"
                title={isExporting ? t('chat.loading') : t('chat.export')}
              >
                <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
                {isExporting ? t('chat.loading') : t('chat.export')}
              </Button>
            }
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">
              {t('chat.exportFormat')}
            </div>
            {(['txt', 'markdown', 'json', 'pdf'] as ExportFormat[]).map((format) => {
              const Icon = formatIcons[format]
              return (
                <Button
                  key={format}
                  type="button"
                  variant="ghostLeft"
                  size="none"
                  onClick={() => handleExport(format)}
                  className="w-full px-3 py-2 text-sm rounded-xl"
                >
                  <Icon className="w-4 h-4" />
                  {t(`chat.${format}`)}
                </Button>
              )
            })}
          </Dropdown>
        )}
        <Link
          href="/metrics"
          className="px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
          title={t('settings.metrics')}
        >
          <BarChart3 className="w-4 h-4" />
          {t('settings.metrics')}
        </Link>
        {onSelectTemplate && (
          <PromptTemplates
            onSelectTemplate={onSelectTemplate}
            currentInput={currentInput}
          />
        )}
      </div>
    </div>
  )
}

