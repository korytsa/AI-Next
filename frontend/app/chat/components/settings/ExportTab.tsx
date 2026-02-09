'use client'

import { Download, FileText, FileCode, FileJson, FileType } from 'lucide-react'
import { ExportFormat } from '@/app/lib/export-formats'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { Button } from '@/app/components/Button'
import { Heading } from '@/app/components/Heading'

interface ExportTabProps {
  onExportDialog?: (format: ExportFormat) => void
  loading: boolean
  isExporting?: boolean
}

export function ExportTab({ onExportDialog, loading, isExporting = false }: ExportTabProps) {
  const { t } = useLanguage()

  const formatIcons = {
    txt: FileText,
    markdown: FileCode,
    json: FileJson,
    pdf: FileType,
  }

  const handleExport = (format: ExportFormat) => {
    onExportDialog?.(format)
  }

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h3" size="sm" weight="medium" className="mb-4">
          {t('chat.exportFormat')}
        </Heading>
        <div className="grid grid-cols-2 gap-3">
          {(['txt', 'markdown', 'json', 'pdf'] as ExportFormat[]).map((format) => {
            const Icon = formatIcons[format]
            return (
              <Button
                key={format}
                type="button"
                variant="ghost"
                size="none"
                onClick={() => handleExport(format)}
                disabled={loading || isExporting}
                className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-700/50 shadow-soft hover:shadow-soft-lg group"
              >
                <div className="p-2 bg-indigo-100/80 dark:bg-indigo-900/30 rounded-xl group-hover:bg-indigo-200/80 dark:group-hover:bg-indigo-800/50 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t(`chat.${format}`)}
                </span>
              </Button>
            )
          })}
        </div>
        {isExporting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
            <Download className="w-4 h-4 animate-pulse" />
            <span>{t('chat.loading')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
