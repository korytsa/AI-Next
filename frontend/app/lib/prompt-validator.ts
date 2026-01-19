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
    message: 'Attempting to ignore system instructions is not allowed'
  },
  {
    pattern: /forget\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: 'Attempting to ignore system instructions is not allowed'
  },
  {
    pattern: /disregard\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: 'Attempting to ignore system instructions is not allowed'
  },
  {
    pattern: /override\s+(all\s+)?(previous|prior|earlier|above)\s+(instructions?|prompts?|rules?|directives?)/i,
    message: 'Attempting to override system instructions is not allowed'
  },
  {
    pattern: /(show|display|reveal|tell|give|print|output|repeat|echo)\s+(me\s+)?(all\s+)?(the\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?|prompt)/i,
    message: 'Requesting system instructions is not allowed'
  },
  {
    pattern: /what\s+(are\s+)?(your\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?)/i,
    message: 'Requesting system instructions is not allowed'
  },
  {
    pattern: /repeat\s+(the\s+)?(system\s+)?(instructions?|prompts?|rules?|directives?)/i,
    message: 'Requesting system instructions is not allowed'
  },
  {
    pattern: /(you\s+are\s+now|you\s+have\s+become|act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(a\s+)?(different|evil|malicious|hacker|attacker)/i,
    message: 'Attempting to change the assistant\'s role or behavior is not allowed'
  },
  {
    pattern: /(switch|change)\s+(to\s+)?(a\s+)?(different|evil|malicious|hacker|attacker)\s+(mode|role|persona)/i,
    message: 'Attempting to change the assistant\'s role or behavior is not allowed'
  },
  {
    pattern: /execute\s+(the\s+)?(following|below|next)\s+(commands?|instructions?|code)/i,
    message: 'Attempting to execute commands is not allowed'
  },
  {
    pattern: /run\s+(the\s+)?(following|below|next)\s+(commands?|instructions?|code)/i,
    message: 'Attempting to execute commands is not allowed'
  },
  {
    pattern: /system\s*:\s*[^\n]*ignore/i,
    message: 'Invalid system command detected'
  },
  {
    pattern: /<\|system\|>/i,
    message: 'Invalid system markers detected'
  },
  {
    pattern: /<\|assistant\|>/i,
    message: 'Invalid system markers detected'
  },
  {
    pattern: /translate\s+(this\s+)?(to\s+)?(english|spanish|french|german|russian)/i,
    message: 'Translation requests that may hide malicious content are not allowed'
  },
  {
    pattern: /what\s+does\s+this\s+say/i,
    message: 'Translation requests that may hide malicious content are not allowed'
  },
  {
    pattern: /(base64|hex|binary|encode|decode)/i,
    message: 'Encoding/decoding requests are not allowed'
  },
  {
    pattern: /(show|display|reveal|tell|give|print|output)\s+(me\s+)?(the\s+)?(api\s+)?(key|token|password|secret|credentials?)/i,
    message: 'Requesting sensitive information is not allowed'
  },
  {
    pattern: /what\s+(is\s+)?(your\s+)?(api\s+)?(key|token|password|secret|credentials?)/i,
    message: 'Requesting sensitive information is not allowed'
  },
]

const DANGEROUS_SPECIAL_CHARS = [
  '<|', '|>',  
  '```system', '```assistant',  
  '---', '===', 
]

function checkInjectionPatterns(text: string): string[] {
  const errors: string[] = []
  
  for (const item of INJECTION_PATTERNS) {
    if (item.pattern.test(text)) {
      errors.push(item.message)
    }
  }
  
  return errors
}

function checkSpecialCharacters(text: string): string[] {
  const warnings: string[] = []
  
  for (const char of DANGEROUS_SPECIAL_CHARS) {
    if (text.includes(char)) {
      warnings.push('Potentially unsafe characters detected in your message')
    }
  }
  
  return warnings
}

function checkLength(text: string, maxLength: number): string[] {
  const errors: string[] = []
  
  if (text.length > maxLength) {
    errors.push(`Your message is too long. Maximum length is ${maxLength.toLocaleString()} characters.`)
  }
  
  return errors
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

  const errors: string[] = []
  const warnings: string[] = []

  if (!prompt || typeof prompt !== 'string') {
    return {
      isValid: false,
      errors: ['Please enter a message'],
      warnings: [],
    }
  }

  const trimmedPrompt = prompt.trim()

  if (trimmedPrompt.length === 0) {
    return {
      isValid: false,
      errors: ['Please enter a message'],
      warnings: [],
    }
  }

  if (shouldCheckLength) {
    errors.push(...checkLength(trimmedPrompt, maxLength))
  }

  if (checkInjection) {
    errors.push(...checkInjectionPatterns(trimmedPrompt))
  }

  if (checkSpecialChars) {
    warnings.push(...checkSpecialCharacters(trimmedPrompt))
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function validateMessages(
  messages: any[],
  options: ValidationOptions = {}
): ValidationResult {
  if (!Array.isArray(messages)) {
    return {
      isValid: false,
      errors: ['Invalid message format'],
      warnings: [],
    }
  }

  const allErrors: string[] = []
  const allWarnings: string[] = []

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i]
    
    if (!message || typeof message !== 'object') {
      allErrors.push('Invalid message format')
      continue
    }

    if (message.role === 'user' && message.content) {
      const result = validatePrompt(message.content, options)
      
      if (!result.isValid) {
        allErrors.push(...result.errors)
      }
      
      allWarnings.push(...result.warnings)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  }
}

export function sanitizePrompt(prompt: string): string {
  let sanitized = prompt

  for (const item of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(item.pattern, '')
  }

  for (const char of DANGEROUS_SPECIAL_CHARS) {
    sanitized = sanitized.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '')
  }

  return sanitized.trim()
}
