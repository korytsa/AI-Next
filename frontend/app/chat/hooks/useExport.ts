import { useState } from 'react'
import { Message } from '../types'
import { exportMessages, getFileExtension, getMimeType, ExportFormat } from '@/app/lib/export-formats'

export function useExport(messages: Message[]) {
  const [isExporting, setIsExporting] = useState(false)

  const exportDialog = async (format: ExportFormat = 'txt') => {
    if (messages.length === 0) return

    try {
      setIsExporting(true)

      if (format === 'pdf') {
        exportMessages(messages, format)
        return
      }

      const exportedContent = exportMessages(messages, format)
      if (!exportedContent) return

      const blob = new Blob([exportedContent], { type: getMimeType(format) })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chat-export-${new Date().toISOString().split('T')[0]}.${getFileExtension(format)}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export messages:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return { exportDialog, isExporting }
}
