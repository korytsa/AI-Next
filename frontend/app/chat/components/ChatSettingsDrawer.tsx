'use client'

import { X, Settings, Bot, Volume2, Download, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Drawer } from '@/app/components/Drawer'
import { Heading } from '@/app/components/Heading'
import { useState } from 'react'
import { ExportFormat } from '@/app/lib/export-formats'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { SettingsTabBar, type SettingsTabId } from './settings/SettingsTabBar'
import { SettingsTabContent } from './settings/SettingsTabContent'

interface ChatSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
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
  useCache?: boolean
  onToggleUseCache?: () => void
  onExportDialog?: (format: ExportFormat) => void
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
}

export function ChatSettingsDrawer({
  isOpen,
  onClose,
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
  useCache = false,
  onToggleUseCache,
  onExportDialog,
  isExporting = false,
  currentInput = '',
  onSelectTemplate,
}: ChatSettingsDrawerProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<SettingsTabId>('ai')

  const tabs = [
    { id: 'ai' as const, label: t('settings.aiSettings'), icon: Bot },
    { id: 'voice' as const, label: t('settings.voice'), icon: Volume2 },
    { id: 'export' as const, label: t('chat.export'), icon: Download },
    { id: 'templates' as const, label: t('settings.templates'), icon: FileText },
    { id: 'metrics' as const, label: t('settings.metrics'), icon: BarChart3 },
    { id: 'errors' as const, label: t('settings.errors'), icon: AlertTriangle },
  ]

  return (
    <Drawer open={isOpen} onClose={onClose} panelClassName="max-w-4xl">
      <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <Heading as="h2" size="xl" weight="semibold" color="inherit">
            {t('settings.title')}
          </Heading>
        </div>
        <Button variant="iconClose" size="iconMd" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <SettingsTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <SettingsTabContent
        activeTab={activeTab}
        selectedModel={selectedModel}
        onSetSelectedModel={onSetSelectedModel}
        responseMode={responseMode}
        onSetResponseMode={onSetResponseMode}
        chainOfThought={chainOfThought}
        onSetChainOfThought={onSetChainOfThought}
        useStreaming={useStreaming}
        onToggleStreaming={onToggleStreaming}
        useRAG={useRAG}
        onToggleUseRAG={onToggleUseRAG}
        useCache={useCache}
        onToggleUseCache={onToggleUseCache}
        loading={loading}
        autoPlayVoice={autoPlayVoice}
        onToggleAutoPlayVoice={onToggleAutoPlayVoice}
        onExportDialog={onExportDialog}
        isExporting={isExporting}
        currentInput={currentInput}
        onSelectTemplate={onSelectTemplate}
      />
    </Drawer>
  )
}

