import { ModerationMessage } from './app-strings'

export interface ModerationResult {
  isSafe: boolean
  categories: string[]
  score: number
  reasons: string[]
}

export interface ModerationOptions {
  checkToxicity?: boolean
  checkProfanity?: boolean
  checkSpam?: boolean
  checkPersonalInfo?: boolean
  customBlocklist?: string[]
}

const BLOCKLIST = [
  'kill yourself',
  'you should die',
  'hate you',
  'bomb',
  'terrorist',
  'attack',
]

const PERSONAL_INFO_PATTERNS = [
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
  /\b\d{3}-\d{2}-\d{4}\b/,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b.*password/i,
]

const SPAM_PATTERNS = [
  /(click\s+here|buy\s+now|limited\s+time|act\s+now|urgent|asap)/i,
  /(free\s+money|make\s+money\s+fast|get\s+rich)/i,
  /(http|https|www\.).{0,10}(bit\.ly|tinyurl|short\.link)/i,
]

function checkToxicity(text: string): { isToxic: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  const profanityPatterns = [
    /\b(fuck|shit|damn|bitch|asshole|idiot|stupid|dumb)\b/i,
  ]
  
  for (const pattern of profanityPatterns) {
    if (pattern.test(text)) {
      reasons.push(ModerationMessage.InappropriateLanguage)
      return { isToxic: true, reasons }
    }
  }
  
  return { isToxic: false, reasons }
}

function checkPersonalInfo(text: string): { hasPersonalInfo: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  for (const pattern of PERSONAL_INFO_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(ModerationMessage.SensitiveInfo)
      return { hasPersonalInfo: true, reasons }
    }
  }
  
  return { hasPersonalInfo: false, reasons }
}

function checkSpam(text: string): { isSpam: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(text)) {
      reasons.push(ModerationMessage.Spam)
      return { isSpam: true, reasons }
    }
  }
  
  return { isSpam: false, reasons }
}

function checkBlocklist(text: string, customBlocklist?: string[]): { isBlocked: boolean; reasons: string[] } {
  const reasons: string[] = []
  const lowerText = text.toLowerCase()
  const allBlocklist = [...BLOCKLIST, ...(customBlocklist || [])]
  
  for (const phrase of allBlocklist) {
    if (lowerText.includes(phrase.toLowerCase())) {
      reasons.push(ModerationMessage.Prohibited)
      return { isBlocked: true, reasons }
    }
  }
  
  return { isBlocked: false, reasons }
}

export function moderateContent(
  content: string,
  options: ModerationOptions = {}
): ModerationResult {
  const {
    checkToxicity: shouldCheckToxicity = true,
    checkProfanity = true,
    checkSpam: shouldCheckSpam = true,
    checkPersonalInfo: shouldCheckPersonalInfo = true,
    customBlocklist = [],
  } = options

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return {
      isSafe: false,
      categories: [],
      score: 0,
      reasons: [ModerationMessage.PleaseEnterMessage],
    }
  }

  const categories: string[] = []
  const allReasons: string[] = []
  let score = 1.0

  if (shouldCheckToxicity || checkProfanity) {
    const toxicityCheck = checkToxicity(content)
    if (toxicityCheck.isToxic) {
      categories.push('toxicity')
      allReasons.push(...toxicityCheck.reasons)
      score -= 0.5
    }
  }

  if (shouldCheckPersonalInfo) {
    const personalInfoCheck = checkPersonalInfo(content)
    if (personalInfoCheck.hasPersonalInfo) {
      categories.push('personal_info')
      allReasons.push(...personalInfoCheck.reasons)
      score -= 0.3
    }
  }

  if (shouldCheckSpam) {
    const spamCheck = checkSpam(content)
    if (spamCheck.isSpam) {
      categories.push('spam')
      allReasons.push(...spamCheck.reasons)
      score -= 0.2
    }
  }

  if (customBlocklist.length > 0 || BLOCKLIST.length > 0) {
    const blocklistCheck = checkBlocklist(content, customBlocklist)
    if (blocklistCheck.isBlocked) {
      categories.push('blocklist')
      allReasons.push(...blocklistCheck.reasons)
      score -= 0.4
    }
  }

  score = Math.max(0, Math.min(1, score))

  return {
    isSafe: categories.length === 0,
    categories,
    score,
    reasons: allReasons,
  }
}

export function moderateMessages(
  messages: any[],
  options: ModerationOptions = {}
): { isSafe: boolean; results: ModerationResult[]; overallScore: number } {
  if (!Array.isArray(messages)) {
    return {
      isSafe: false,
      results: [],
      overallScore: 0,
    }
  }

  const results: ModerationResult[] = []
  let totalScore = 0
  let safeCount = 0

  for (const message of messages) {
    if (message && message.role === 'user' && message.content) {
      const result = moderateContent(message.content, options)
      results.push(result)
      
      if (result.isSafe) {
        safeCount++
      }
      
      totalScore += result.score
    }
  }

  const overallScore = results.length > 0 ? totalScore / results.length : 1.0

  return {
    isSafe: results.every(r => r.isSafe),
    results,
    overallScore,
  }
}
