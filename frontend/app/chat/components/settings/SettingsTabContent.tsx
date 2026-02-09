'use client'

import { ExportFormat } from '@/app/lib/export-formats'
import { ResponseMode, ChainOfThoughtMode } from '../../hooks/useChat'
import { PromptTemplates } from '../PromptTemplates'
import { AISettingsTab } from './AISettingsTab'
import { VoiceSettingsTab } from './VoiceSettingsTab'
import { ExportTab } from './ExportTab'
import { MetricsTab } from './MetricsTab'
import { ErrorsTab } from './ErrorsTab'
import type { SettingsTabId } from './SettingsTabBar'

export interface SettingsTabContentProps {
  activeTab: SettingsTabId
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
  autoPlayVoice?: boolean
  onToggleAutoPlayVoice?: () => void
  onExportDialog?: (format: ExportFormat) => void
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
}

export function SettingsTabContent({
  activeTab,
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
  autoPlayVoice = false,
  onToggleAutoPlayVoice,
  onExportDialog,
  isExporting = false,
  currentInput = '',
  onSelectTemplate,
}: SettingsTabContentProps) {
  return (
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

      {activeTab === 'metrics' && <MetricsTab />}

      {activeTab === 'errors' && <ErrorsTab />}
    </div>
  )
}
