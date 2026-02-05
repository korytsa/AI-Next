'use client'

import { useState } from 'react'
import { FileText, X, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { usePromptTemplates, PromptTemplate } from '../hooks/usePromptTemplates'

interface PromptTemplatesProps {
  onSelectTemplate: (content: string) => void
  currentInput: string
  showAll?: boolean
}

export function PromptTemplates({ onSelectTemplate, currentInput, showAll = false }: PromptTemplatesProps) {
  const { t } = useLanguage()
  const { templates, saveTemplate, deleteTemplate } = usePromptTemplates()
  const [isOpen, setIsOpen] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [templateName, setTemplateName] = useState('')

  const handleSaveTemplate = () => {
    if (!currentInput.trim()) return
    
    const name = templateName.trim() || `Template ${templates.length + 1}`
    if (saveTemplate(name, currentInput)) {
      setShowSaveDialog(false)
      setTemplateName('')
    }
  }

  const handleSelectTemplate = (template: PromptTemplate) => {
    onSelectTemplate(template.content)
    setIsOpen(false)
  }

  if (showAll) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('templates.title')}</h3>
          <button
            type="button"
            onClick={() => {
              if (currentInput.trim()) {
                setShowSaveDialog(true)
              }
            }}
            disabled={!currentInput.trim()}
            className="px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/30 rounded-2xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-soft-lg"
            title={t('templates.save')}
          >
            <Plus className="w-4 h-4" />
            {t('templates.save')}
          </button>
        </div>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl border border-slate-200/50 dark:border-slate-700/50 p-6 min-w-[400px] max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('templates.saveTemplate')}</h3>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }}
                  className="p-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder={t('templates.namePlaceholder')}
                className="w-full px-4 py-3 text-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl mb-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 shadow-soft"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTemplate()
                  } else if (e.key === 'Escape') {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }
                }}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2.5 text-sm bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all duration-200 shadow-soft hover:shadow-soft-lg"
                >
                  {t('templates.save')}
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false)
                    setTemplateName('')
                  }}
                  className="px-4 py-2.5 text-sm bg-slate-200/80 dark:bg-slate-700/80 rounded-2xl hover:bg-slate-300/80 dark:hover:bg-slate-600/80 transition-all duration-200"
                >
                  {t('chat.cancel')}
                </button>
              </div>
            </div>
          </div>
        )}

        {templates.length > 0 ? (
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-start justify-between p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-700/50 transition-all duration-200 group shadow-soft hover:shadow-soft-lg"
              >
                <button
                  onClick={() => handleSelectTemplate(template)}
                  className="flex-1 text-left"
                >
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{template.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {template.content}
                  </div>
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="ml-4 p-2 opacity-0 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                  title={t('templates.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">{t('templates.noTemplates')}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
          title={t('templates.title')}
        >
          <FileText className="w-4 h-4" />
          {t('templates.title')}
        </button>
        <button
          type="button"
          onClick={() => {
            if (currentInput.trim()) {
              setShowSaveDialog(true)
            }
          }}
          disabled={!currentInput.trim()}
          className="px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('templates.save')}
        >
          <Plus className="w-4 h-4" />
          {t('templates.save')}
        </button>
      </div>

      {showSaveDialog && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{t('templates.saveTemplate')}</h3>
            <button
              onClick={() => {
                setShowSaveDialog(false)
                setTemplateName('')
              }}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={t('templates.namePlaceholder')}
            className="w-full px-3 py-2 text-sm border rounded-lg mb-3 dark:bg-gray-700 dark:border-gray-600"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTemplate()
              } else if (e.key === 'Escape') {
                setShowSaveDialog(false)
                setTemplateName('')
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveTemplate}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('templates.save')}
            </button>
            <button
              onClick={() => {
                setShowSaveDialog(false)
                setTemplateName('')
              }}
              className="px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {t('chat.cancel')}
            </button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[300px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">{t('templates.title')}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {templates.length > 0 ? (
            <div className="space-y-1">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group"
                >
                  <button
                    onClick={() => handleSelectTemplate(template)}
                    className="flex-1 text-left text-sm"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {template.content.substring(0, 50)}
                      {template.content.length > 50 ? '...' : ''}
                    </div>
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-opacity"
                    title={t('templates.delete')}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
              {t('templates.noTemplates')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
