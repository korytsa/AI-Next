import { ValidationMessage } from './app-strings'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface ValidationOptions {
  maxLength?: number
  checkInjection?: boolean
  checkSpecialChars?: boolean
  checkLength?: boolean
}

const DEFAULT_MAX_LENGTH = 10000

const INJECTION_PATTERNS = [
  {
    pattern: /ignore\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.IgnoreInstructions,
  },
  {
    pattern: /forget\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.IgnoreInstructions,
  },
  {
    pattern: /disregard\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.IgnoreInstructions,
  },
  {
    pattern: /override\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.OverrideInstructions,
  },
  {
    pattern: /(show|display|reveal|tell|give|print|output|repeat|echo)\s+(me\s+)?(all\s+)?(the\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?|prompt)/i,
    message: ValidationMessage.RequestInstructions,
  },
  {
    pattern: /what\s+(are\s+)?(your\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.RequestInstructions,
  },
  {
    pattern: /repeat\s+(the\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?)/i,
    message: ValidationMessage.RequestInstructions,
  },
  {
    pattern: /(you\s+are\s+now|you\s+have\s+become|act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(a\s+)?(different|evil|malicious|hacker|attacker)/i,
    message: ValidationMessage.ChangeRole,
  },
  {
    pattern: /(switch|change)\s+(to\s+)?(a\s+)?(different|evil|malicious|hacker|attacker)\s+(mode|role|persona)/i,
    message: ValidationMessage.ChangeRole,
  },
  {
    pattern: /execute\s+(the\s+)?(following|below|next)\s+(commands?|instructions?|code)/i,
    message: ValidationMessage.ExecuteCommands,
  },
  {
    pattern: /run\s+(the\s+)?(following|below|next)\s+(commands?|instructions?|code)/i,
    message: ValidationMessage.ExecuteCommands,
  },
  {
    pattern: /system\s*:\s*[^\n]*ignore/i,
    message: ValidationMessage.InvalidSystemCommand,
  },
  {
    pattern: /<\|system\|>/i,
    message: ValidationMessage.InvalidSystemMarkers,
  },
  {
    pattern: /<\|assistant\|>/i,
    message: ValidationMessage.InvalidSystemMarkers,
  },
  {
    pattern: /translate\s+(this\s+)?(to\s+)?(english|spanish|french|german|russian)/i,
    message: ValidationMessage.TranslationNotAllowed,
  },
  {
    pattern: /what\s+does\s+this\s+say/i,
    message: ValidationMessage.TranslationNotAllowed,
  },
  {
    pattern: /(base64|hex|binary|encode|decode)/i,
    message: ValidationMessage.EncodingNotAllowed,
  },
  {
    pattern: /(show|display|reveal|tell|give|print|output)\s+(me\s+)?(the\s+)?(api\s+)?(key|token|password|secret|credentials?)/i,
    message: ValidationMessage.SensitiveInfoNotAllowed,
  },
  {
    pattern: /what\s+(is\s+)?(your\s+)?(api\s+)?(key|token|password|secret|credentials?)/i,
    message: ValidationMessage.SensitiveInfoNotAllowed,
  },
]

const DANGEROUS_SPECIAL_CHARS = [
  '<|', '|>',  
  '```system', '```assistant',  
  '---', '===', 
]

function checkInjectionPatterns(text: string): string[] {
  return INJECTION_PATTERNS.filter((item) => item.pattern.test(text)).map((item) => item.message)
}

function checkSpecialCharacters(text: string): string[] {
  return DANGEROUS_SPECIAL_CHARS.some((char) => text.includes(char))
    ? [ValidationMessage.UnsafeCharacters]
    : []
}

function checkLength(text: string, maxLength: number): string[] {
  return text.length > maxLength ? [ValidationMessage.MessageTooLong(maxLength)] : []
}

export function validatePrompt(
  prompt: string,
  options: ValidationOptions = {}
): ValidationResult {
  const {
    maxLength = DEFAULT_MAX_LENGTH,
    checkInjection = true,
    checkSpecialChars = true,
    checkLength: shouldCheckLength = true,
  } = options

  if (!prompt || typeof prompt !== 'string') {
    return { isValid: false, errors: [ValidationMessage.PleaseEnterMessage], warnings: [] }
  }

  const trimmedPrompt = prompt.trim()
  if (trimmedPrompt.length === 0) {
    return { isValid: false, errors: [ValidationMessage.PleaseEnterMessage], warnings: [] }
  }

  const errors: string[] = []
  if (shouldCheckLength) errors.push(...checkLength(trimmedPrompt, maxLength))
  if (checkInjection) errors.push(...checkInjectionPatterns(trimmedPrompt))

  const warnings: string[] = []
  if (checkSpecialChars) warnings.push(...checkSpecialCharacters(trimmedPrompt))

  return { isValid: errors.length === 0, errors, warnings }
}

export function validateMessages(
  messages: any[],
  options: ValidationOptions = {}
): ValidationResult {
  if (!Array.isArray(messages)) {
    return { isValid: false, errors: [ValidationMessage.InvalidFormat], warnings: [] }
  }

  const allErrors: string[] = []
  const allWarnings: string[] = []

  for (const message of messages) {
    if (!message || typeof message !== 'object') {
      allErrors.push(ValidationMessage.InvalidFormat)
      continue
    }

    if (message.role === 'user' && message.content) {
      const result = validatePrompt(message.content, options)
      if (!result.isValid) allErrors.push(...result.errors)
      allWarnings.push(...result.warnings)
    }
  }

  return { isValid: allErrors.length === 0, errors: allErrors, warnings: allWarnings }
}

export function sanitizePrompt(prompt: string): string {
  let sanitized = INJECTION_PATTERNS.reduce((text, item) => text.replace(item.pattern, ''), prompt)
  
  for (const char of DANGEROUS_SPECIAL_CHARS) {
    sanitized = sanitized.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
  }

  return sanitized.trim()
}
