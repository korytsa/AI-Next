'use client'

import { X, Settings, Bot, Volume2, Download, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Drawer } from '@/app/components/Drawer'
import { Heading } from '@/app/components/Heading'
import { useState } from 'react'
import { ExportFormat } from '@/app/lib/export-formats'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { PromptTemplates } from './PromptTemplates'
import { AISettingsTab } from './settings/AISettingsTab'
import { VoiceSettingsTab } from './settings/VoiceSettingsTab'
import { ExportTab } from './settings/ExportTab'
import { MetricsTab } from './settings/MetricsTab'
import { ErrorsTab } from './settings/ErrorsTab'

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

type TabType = 'ai' | 'voice' | 'export' | 'templates' | 'metrics' | 'errors'

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
  const [activeTab, setActiveTab] = useState<TabType>('ai')

  const tabs: { id: TabType; label: string; icon: typeof Settings }[] = [
    { id: 'ai', label: t('settings.aiSettings'), icon: Bot },
    { id: 'voice', label: t('settings.voice'), icon: Volume2 },
    { id: 'export', label: t('chat.export'), icon: Download },
    { id: 'templates', label: t('settings.templates'), icon: FileText },
    { id: 'metrics', label: t('settings.metrics'), icon: BarChart3 },
    { id: 'errors', label: t('settings.errors'), icon: AlertTriangle },
  ]


  return (
    <Drawer open={isOpen} onClose={onClose} panelClassName="max-w-4xl">
      <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <Heading as="h2" size="xl" weight="semibold" color="inherit">{t('settings.title')}</Heading>
        </div>
        <Button variant="iconClose" size="iconMd" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant="tab"
              size="tab"
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="text-sm font-medium whitespace-nowrap"
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'ai' && (
          <AISettingsTab
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
          />
        )}

        {activeTab === 'voice' && (
          <VoiceSettingsTab
            autoPlayVoice={autoPlayVoice}
            onToggleAutoPlayVoice={onToggleAutoPlayVoice}
            loading={loading}
          />
        )}

        {activeTab === 'export' && (
          <ExportTab
            onExportDialog={onExportDialog}
            loading={loading}
            isExporting={isExporting}
          />
        )}

        {activeTab === 'templates' && onSelectTemplate && (
          <PromptTemplates
            onSelectTemplate={onSelectTemplate}
            currentInput={currentInput}
            showAll={true}
          />
        )}

        {activeTab === 'metrics' && (
          <MetricsTab />
        )}

        {activeTab === 'errors' && (
          <ErrorsTab />
        )}
      </div>
    </Drawer>
  )
}

