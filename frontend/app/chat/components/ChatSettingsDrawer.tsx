'use client'

import { X, Settings, Bot, Volume2, Download, FileText, BarChart3, AlertTriangle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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
  onExportDialog,
  isExporting = false,
  currentInput = '',
  onSelectTemplate,
}: ChatSettingsDrawerProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<TabType>('ai')
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const tabs: { id: TabType; label: string; icon: typeof Settings }[] = [
    { id: 'ai', label: t('settings.aiSettings'), icon: Bot },
    { id: 'voice', label: t('settings.voice'), icon: Volume2 },
    { id: 'export', label: t('chat.export'), icon: Download },
    { id: 'templates', label: t('settings.templates'), icon: FileText },
    { id: 'metrics', label: t('settings.metrics'), icon: BarChart3 },
    { id: 'errors', label: t('settings.errors'), icon: AlertTriangle },
  ]


  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/50 shadow-soft-xl z-[100] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold">{t('settings.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
              </button>
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
      </div>
    </>
  )
}

