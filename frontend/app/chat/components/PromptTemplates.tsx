'use client'

import { useState } from 'react'
import { FileText, X, Plus, Trash2 } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { usePromptTemplates, PromptTemplate } from '../hooks/usePromptTemplates'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { Modal } from '@/app/components/Modal'
import { Card } from '@/app/components/Card'
import { Heading } from '@/app/components/Heading'

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
          <Heading as="h3" size="lg" weight="semibold">{t('templates.title')}</Heading>
          <Button
            type="button"
            variant="successGhost"
            size="md"
            onClick={() => {
              if (currentInput.trim()) {
                setShowSaveDialog(true)
              }
            }}
            disabled={!currentInput.trim()}
            title={t('templates.save')}
          >
            <Plus className="w-4 h-4" />
            {t('templates.save')}
          </Button>
        </div>

        <Modal
          open={showSaveDialog}
          onClose={() => {
            setShowSaveDialog(false)
            setTemplateName('')
          }}
          title={t('templates.saveTemplate')}
        >
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={t('templates.namePlaceholder')}
            size="md"
            className="mb-4"
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
            <Button
              variant="primary"
              size="md"
              onClick={handleSaveTemplate}
              className="flex-1 py-2.5 shadow-soft hover:shadow-soft-lg"
            >
              {t('templates.save')}
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setShowSaveDialog(false)
                setTemplateName('')
              }}
              className="py-2.5"
            >
              {t('chat.cancel')}
            </Button>
          </div>
        </Modal>

        {templates.length > 0 ? (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                variant="hoverable"
                className="flex items-start justify-between group"
              >
                <Button
                  variant="ghostLeft"
                  size="none"
                  onClick={() => handleSelectTemplate(template)}
                  className="flex-1 p-0 min-h-0 h-auto justify-start rounded-2xl"
                >
                  <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{template.name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {template.content}
                  </div>
                </Button>
                <Button
                  variant="dangerIcon"
                  size="iconSm"
                  onClick={() => deleteTemplate(template.id)}
                  className="ml-4"
                  title={t('templates.delete')}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </Card>
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
        <Button
          type="button"
          variant="primaryGhost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
          title={t('templates.title')}
        >
          <FileText className="w-4 h-4" />
          {t('templates.title')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            if (currentInput.trim()) {
              setShowSaveDialog(true)
            }
          }}
          disabled={!currentInput.trim()}
          className="text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
          title={t('templates.save')}
        >
          <Plus className="w-4 h-4" />
          {t('templates.save')}
        </Button>
      </div>

      {showSaveDialog && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[300px]">
          <div className="flex items-center justify-between mb-3">
            <Heading as="h3" size="sm" weight="semibold" color="inherit">{t('templates.saveTemplate')}</Heading>
            <Button
              variant="iconClose"
              size="iconTiny"
              onClick={() => {
                setShowSaveDialog(false)
                setTemplateName('')
              }}
              className="p-1 rounded"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder={t('templates.namePlaceholder')}
            size="sm"
            className="rounded-lg mb-3"
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
            <Button
              variant="blue"
              size="sm"
              onClick={handleSaveTemplate}
              className="flex-1 rounded-lg"
            >
              {t('templates.save')}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowSaveDialog(false)
                setTemplateName('')
              }}
              className="rounded-lg"
            >
              {t('chat.cancel')}
            </Button>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[300px] max-h-[400px] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <Heading as="h3" size="sm" weight="semibold" color="inherit">{t('templates.title')}</Heading>
            <Button
              variant="iconClose"
              size="iconTiny"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          {templates.length > 0 ? (
            <div className="space-y-1">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group"
                >
                  <Button
                    variant="ghostLeft"
                    size="none"
                    onClick={() => handleSelectTemplate(template)}
                    className="flex-1 p-0 min-h-0 h-auto justify-start text-sm rounded"
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {template.content.substring(0, 50)}
                      {template.content.length > 50 ? '...' : ''}
                    </div>
                  </Button>
                  <Button
                    variant="dangerIcon"
                    size="iconTiny"
                    onClick={() => deleteTemplate(template.id)}
                    className="p-1 rounded"
                    title={t('templates.delete')}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
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
