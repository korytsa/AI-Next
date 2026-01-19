export interface SanitizationOptions {
  removeHtml?: boolean
  normalizeWhitespace?: boolean
  removeControlChars?: boolean
}

export function sanitizeText(
  text: string,
  options: SanitizationOptions = {}
): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const {
    removeHtml = true,
    normalizeWhitespace = true,
    removeControlChars = true,
  } = options

  let sanitized = text

  if (removeControlChars) {
    sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
  }

  if (removeHtml) {
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
  }

  if (normalizeWhitespace) {
    sanitized = sanitized
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[\s\u00A0\u2000-\u200B\u2028\u2029\u3000]+/g, ' ')
      .replace(/^[\s\u00A0\u2000-\u200B\u2028\u2029\u3000]+/gm, '')
      .replace(/[\s\u00A0\u2000-\u200B\u2028\u2029\u3000]+$/gm, '')
  }

  return sanitized.trim()
}

export function sanitizeMessage(message: any): any {
  if (!message || typeof message !== 'object') {
    return message
  }

  if (message.content && typeof message.content === 'string') {
    return {
      ...message,
      content: sanitizeText(message.content, {
        removeHtml: true,
        normalizeWhitespace: true,
        removeControlChars: true,
      }),
    }
  }

  return message
}

export function sanitizeMessages(messages: any[]): any[] {
  if (!Array.isArray(messages)) {
    return []
  }

  return messages.map(sanitizeMessage)
}
