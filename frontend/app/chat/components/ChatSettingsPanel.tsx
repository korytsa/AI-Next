import { Download, BarChart3, AlertTriangle, FileText, FileCode, FileJson, FileType } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
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
  const exportMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }

    if (showExportMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportMenu])

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
          <select
            value={selectedModel}
            onChange={(e) => onSetSelectedModel(e.target.value)}
            disabled={loading}
            className="pl-3 pr-9 py-2 text-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:12px_8px] shadow-soft transition-all duration-200"
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
            className={`px-3 py-1.5 text-sm rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft ${
              responseMode === 'short'
                ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
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
            className={`px-3 py-1.5 text-sm rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft ${
              chainOfThought === 'none'
                ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
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
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 shadow-soft ${
              useStreaming ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-700'
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
        {onToggleAutoPlayVoice && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">{t('settings.autoPlayVoice')}:</span>
            <button
              type="button"
              onClick={onToggleAutoPlayVoice}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoPlayVoice ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              disabled={loading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoPlayVoice ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
        {onToggleUseRAG && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">RAG:</span>
            <button
              type="button"
              onClick={onToggleUseRAG}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                useRAG ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              disabled={loading}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  useRAG ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        )}
        {onExportDialog && (
          <div className="relative" ref={exportMenuRef}>
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={loading || isExporting}
              className="px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
              title={isExporting ? t('chat.loading') : t('chat.export')}
            >
              <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
              {isExporting ? t('chat.loading') : t('chat.export')}
            </button>
            {showExportMenu && !isExporting && (
              <div className="absolute top-full left-0 mt-2 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-soft-xl border border-slate-200/50 dark:border-slate-700/50 p-3 min-w-[180px]">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 mb-1">
                  {t('chat.exportFormat')}
                </div>
                {(['txt', 'markdown', 'json', 'pdf'] as ExportFormat[]).map((format) => {
                  const Icon = formatIcons[format]
                  return (
                    <button
                      key={format}
                      type="button"
                      onClick={() => handleExport(format)}
                      className="w-full px-3 py-2 text-sm text-left hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl flex items-center gap-2 transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                      {t(`chat.${format}`)}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}
        <Link
          href="/metrics"
          className="px-4 py-2.5 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
          title={t('settings.metrics')}
        >
          <BarChart3 className="w-4 h-4" />
          {t('settings.metrics')}
        </Link>
        <Link
          href="/errors"
          className="px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-2xl transition-all duration-200 flex items-center gap-2 shadow-soft hover:shadow-soft-lg"
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
      </div>
    </div>
  )
}

