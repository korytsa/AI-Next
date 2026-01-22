import { Download, BarChart3, AlertTriangle, Search } from 'lucide-react'
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
  onExportDialog?: () => void
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
  searchQuery?: string
  onSetSearchQuery?: (query: string) => void
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
  onExportDialog,
  isExporting = false,
  currentInput = '',
  onSelectTemplate,
  searchQuery = '',
  onSetSearchQuery,
}: ChatSettingsPanelProps) {
  const { t } = useLanguage()
  
  return (
    <div className="border-t px-4 py-3 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-500">{t('settings.model')}:</label>
          <select
            value={selectedModel}
            onChange={(e) => onSetSelectedModel(e.target.value)}
            disabled={loading}
            className="pl-1.5 pr-8 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:12px_8px]"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-[0.2px]">
          <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.responseMode')}:</span>
          <button
            type="button"
            onClick={() => onSetResponseMode('short')}
            disabled={loading}
            className={`px-2 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              responseMode === 'short'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('settings.short')}
          </button>
          <button
            type="button"
            onClick={() => onSetResponseMode('detailed')}
            disabled={loading}
            className={`px-2 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              responseMode === 'detailed'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('settings.detailed')}
          </button>
        </div>
        <div className="flex items-center gap-[0.2px]">
          <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.chainOfThought')}:</span>
          <button
            type="button"
            onClick={() => onSetChainOfThought('none')}
            disabled={loading}
            className={`px-2 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'none'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('settings.none')}
          </button>
          <button
            type="button"
            onClick={() => onSetChainOfThought('short')}
            disabled={loading}
            className={`px-2 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'short'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('settings.basic')}
          </button>
          <button
            type="button"
            onClick={() => onSetChainOfThought('detailed')}
            disabled={loading}
            className={`px-2 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'detailed'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {t('settings.advanced')}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.streaming')}:</span>
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useStreaming ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useStreaming ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {onExportDialog && (
          <button
            type="button"
            onClick={onExportDialog}
            disabled={loading || isExporting}
            className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title={isExporting ? t('chat.loading') : t('chat.export')}
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? t('chat.loading') : t('chat.export')}
          </button>
        )}
        <Link
          href="/metrics"
          className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
          title={t('settings.metrics')}
        >
          <BarChart3 className="w-4 h-4" />
          {t('settings.metrics')}
        </Link>
        <Link
          href="/errors"
          className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center gap-2"
          title={t('settings.errors')}
        >
          <AlertTriangle className="w-4 h-4" />
          {t('settings.errors')}
        </Link>
        {onSelectTemplate && (
          <PromptTemplates
            onSelectTemplate={onSelectTemplate}
            currentInput={currentInput}
          />
        )}
        {onSetSearchQuery && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-500">{t('settings.searchHistory')}:</label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSetSearchQuery(e.target.value)}
                placeholder={t('settings.searchPlaceholder')}
                className="pl-8 pr-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

