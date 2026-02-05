import { Trash2, Search, Settings } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useState } from 'react'
import { UserNameBadge } from './UserNameBadge'
import { ChatSettingsDrawer } from './ChatSettingsDrawer'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'

interface ChatHeaderProps {
  useStreaming: boolean
  onToggleStreaming: () => void
  loading: boolean
  onClearHistory: () => void
  userName?: string | null
  onEditName?: (name: string) => void
  responseMode: ResponseMode
  onSetResponseMode: (mode: ResponseMode) => void
  onExportDialog?: (format: 'txt' | 'markdown' | 'json' | 'pdf') => void
  totalTokens?: number
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
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
  searchQuery?: string
  onSetSearchQuery?: (query: string) => void
}

export function ChatHeader({ useStreaming, onToggleStreaming, loading, onClearHistory, userName, onEditName, responseMode, onSetResponseMode, onExportDialog, totalTokens, chainOfThought, onSetChainOfThought, selectedModel, onSetSelectedModel, autoPlayVoice, onToggleAutoPlayVoice, useRAG, onToggleUseRAG, useCache, onToggleUseCache, isExporting = false, currentInput = '', onSelectTemplate, searchQuery = '', onSetSearchQuery }: ChatHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { t } = useLanguage()
  
  return (
    <>
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <div className="pl-0.5 pr-16 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="pl-4"></div>
          <h1 className="text-2xl font-bold">{t('chat.title')}</h1>
          <UserNameBadge userName={userName} onChangeName={onEditName} />
        </div>
        <div className="flex items-center gap-4">
        {totalTokens !== undefined && totalTokens > 0 && (
            <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl shadow-soft backdrop-blur-sm">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t('metrics.tokens')}: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{totalTokens.toLocaleString()}</span>
              </span>
            </div>
          )}
          {onSetSearchQuery && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSetSearchQuery(e.target.value)}
                placeholder={t('settings.searchPlaceholder')}
                className="pl-9 pr-4 py-2 text-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 shadow-soft transition-all duration-200"
              />
            </div>
          )}
          <button
            type="button"
            onClick={onClearHistory}
            disabled={loading}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
            title={t('chat.clearHistory')}
          >
            <Trash2 className="w-4 h-4" />
            {t('chat.clearHistory')}
          </button>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-2xl transition-all duration-200 shadow-soft hover:shadow-soft-lg relative"
            title={t('settings.title')}
          >
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        </div>
      </div>
      <ChatSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        useStreaming={useStreaming}
        onToggleStreaming={onToggleStreaming}
        loading={loading}
        responseMode={responseMode}
        onSetResponseMode={onSetResponseMode}
        chainOfThought={chainOfThought}
        onSetChainOfThought={onSetChainOfThought}
        selectedModel={selectedModel}
        onSetSelectedModel={onSetSelectedModel}
        autoPlayVoice={autoPlayVoice}
        onToggleAutoPlayVoice={onToggleAutoPlayVoice}
        useRAG={useRAG}
        onToggleUseRAG={onToggleUseRAG}
        useCache={useCache}
        onToggleUseCache={onToggleUseCache}
        onExportDialog={onExportDialog}
        isExporting={isExporting}
        currentInput={currentInput}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  )
}
