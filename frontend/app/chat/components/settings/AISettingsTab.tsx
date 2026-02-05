'use client'

import { Zap, Sparkles } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../../hooks/useChat'
import { AVAILABLE_MODELS } from '@/app/lib/models'
import { useLanguage } from '@/app/contexts/LanguageContext'

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
  loading,
}: AISettingsTabProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {t('settings.model')}
        </label>
        <select
          value={selectedModel}
          onChange={(e) => onSetSelectedModel(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 text-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_1rem_center] bg-[length:12px_8px] shadow-soft transition-all duration-200"
        >
          {AVAILABLE_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {t('settings.responseMode')}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSetResponseMode('short')}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-sm rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft ${
              responseMode === 'short'
                ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
            }`}
          >
            {t('settings.short')}
          </button>
          <button
            type="button"
            onClick={() => onSetResponseMode('detailed')}
            disabled={loading}
            className={`flex-1 px-4 py-3 text-sm rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft ${
              responseMode === 'detailed'
                ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg font-medium'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
            }`}
          >
            {t('settings.detailed')}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {t('settings.chainOfThought')}
        </label>
        <div className="flex gap-2">
          {(['none', 'short', 'detailed'] as ChainOfThoughtMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSetChainOfThought(mode)}
              disabled={loading}
              className={`flex-1 px-4 py-3 text-sm rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft ${
                chainOfThought === mode
                  ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg font-medium'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
              }`}
            >
              {mode === 'none' ? t('settings.none') : mode === 'short' ? t('settings.basic') : t('settings.advanced')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-indigo-500" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('settings.streaming')}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Real-time responses</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleStreaming}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 shadow-soft ${
            useStreaming ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-slate-300 dark:bg-slate-700'
          }`}
          disabled={loading}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              useStreaming ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {onToggleUseRAG && (
        <div className="flex items-center justify-between p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">RAG</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Knowledge base search</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleUseRAG}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 shadow-soft ${
              useRAG ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                useRAG ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  )
}
