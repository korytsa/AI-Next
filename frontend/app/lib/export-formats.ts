import { Message } from '../chat/types'
import { ApiString } from '@/app/lib/app-strings'

export type ExportFormat = 'txt' | 'markdown' | 'json' | 'pdf'

export function exportToTxt(messages: Message[]): string {
  return messages
    .map((msg) => {
      if (msg.error) {
        return `[ERROR] ${msg.error.message}`
      }
      const role = msg.role === 'user' ? 'User' : 'Assistant'
      return `${role}: ${msg.content}`
    })
    .join('\n\n')
}

export function exportToMarkdown(messages: Message[]): string {
  const lines = ['# Chat Export\n', `Exported: ${new Date().toLocaleString()}\n`]
  
  messages.forEach((msg) => {
    if (msg.error) {
      lines.push(`\n## ⚠️ Error\n\n${msg.error.message}\n`)
      return
    }
    
    const role = msg.role === 'user' ? '**User**' : '**Assistant**'
    lines.push(`\n${role}\n\n${msg.content}\n`)
  })
  
  return lines.join('\n')
}

export function exportToJson(messages: Message[]): string {
  const exportData = {
    exportedAt: new Date().toISOString(),
    messageCount: messages.length,
    messages: messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      error: msg.error ? {
        message: msg.error.message,
        type: msg.error.type,
        retryable: msg.error.retryable,
      } : undefined,
    })),
  }
  
  return JSON.stringify(exportData, null, 2)
}

export function exportToPdf(messages: Message[]): void {
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert(ApiString.ExportPdfPopup)
    return
  }
  
  const htmlParts: string[] = [
    '<h1>Chat Export</h1>',
    `<p style="color: #666; margin-bottom: 30px;">Exported: ${new Date().toLocaleString()}</p>`
  ]
  
  messages.forEach((msg) => {
    if (msg.error) {
      htmlParts.push(
        '<div style="margin: 20px 0;">',
        '<h2 style="color: #d32f2f; margin: 0 0 5px 0;">⚠️ Error</h2>',
        `<p style="margin: 0; color: #d32f2f;">${msg.error.message}</p>`,
        '</div>'
      )
      return
    }
    
    const role = msg.role === 'user' ? 'User' : 'Assistant'
    const roleColor = msg.role === 'user' ? '#1976d2' : '#388e3c'
    
    htmlParts.push(
      '<div style="margin: 20px 0;">',
      `<p style="margin: 0 0 2px 0; font-weight: 600; color: ${roleColor};">${role}</p>`,
      `<div style="margin: 0; white-space: pre-wrap;">${msg.content.replace(/\n/g, '<br>')}</div>`,
      '</div>'
    )
  })
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Chat Export</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
          }
          h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 10px; }
          @media print {
            body { margin: 0; padding: 20px; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        ${htmlParts.join('')}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

export function exportMessages(messages: Message[], format: ExportFormat): string | void {
  switch (format) {
    case 'txt':
      return exportToTxt(messages)
    case 'markdown':
      return exportToMarkdown(messages)
    case 'json':
      return exportToJson(messages)
    case 'pdf':
      exportToPdf(messages)
      return
    default:
      return exportToTxt(messages)
  }
}

export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'txt':
      return 'txt'
    case 'markdown':
      return 'md'
    case 'json':
      return 'json'
    case 'pdf':
      return 'pdf'
    default:
      return 'txt'
  }
}

export function getMimeType(format: ExportFormat): string {
  switch (format) {
    case 'txt':
      return 'text/plain'
    case 'markdown':
      return 'text/markdown'
    case 'json':
      return 'application/json'
    case 'pdf':
      return 'application/pdf'
    default:
      return 'text/plain'
  }
}
