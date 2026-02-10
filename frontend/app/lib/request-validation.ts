import { NextResponse } from 'next/server'
import { validateMessages as validatePromptMessages } from './prompt-validator'
import { moderateMessages } from './content-moderation'
import { sanitizeMessages } from './sanitization'
import { trackError, ErrorMessage, ErrorType } from './errors'

interface ValidationResult {
  isValid: boolean
  response?: NextResponse | globalThis.Response
  sanitizedMessages?: any[]
}

export async function validateAndModerateRequest(
  messages: any[],
  endpoint: string,
  selectedModel: string,
  isStreaming: boolean = false
): Promise<ValidationResult> {
  const sanitizedMessages = sanitizeMessages(messages)

  const promptValidation = validatePromptMessages(sanitizedMessages, {
    maxLength: 10000,
    checkInjection: true,
    checkSpecialChars: true,
    checkLength: true,
  })

  if (!promptValidation.isValid) {
    const uniqueErrors = [...new Set(promptValidation.errors)]
    const baseMessage =
      uniqueErrors.length === 1 ? uniqueErrors[0] : ErrorMessage.ValidationPolicy
    const validationError = new Error(baseMessage)
    validationError.name = 'ValidationError'

    trackError(validationError, {
      endpoint,
      method: 'POST',
      statusCode: 400,
      type: ErrorType.ValidationError,
      model: selectedModel,
      details: uniqueErrors,
    })

    const errorResponse = {
      error: baseMessage,
      details: uniqueErrors,
      type: ErrorType.ValidationError,
    }

    if (isStreaming) {
      return {
        isValid: false,
        response: new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      }
    }

    return {
      isValid: false,
      response: NextResponse.json(errorResponse, { status: 400 }),
    }
  }

  const moderation = moderateMessages(sanitizedMessages, {
    checkToxicity: true,
    checkProfanity: true,
    checkSpam: true,
    checkPersonalInfo: true,
  })

  if (!moderation.isSafe) {
    const allReasons = moderation.results.flatMap((r) => r.reasons)
    const uniqueReasons = [...new Set(allReasons)]
    const baseMessage =
      uniqueReasons.length === 1 ? uniqueReasons[0] : ErrorMessage.ValidationPolicy
    const moderationError = new Error(baseMessage)
    moderationError.name = 'ModerationError'

    trackError(moderationError, {
      endpoint,
      method: 'POST',
      statusCode: 400,
      type: ErrorType.ModerationError,
      model: selectedModel,
      reasons: uniqueReasons,
    })

    const errorResponse = {
      error: baseMessage,
      details: uniqueReasons,
      type: ErrorType.ModerationError,
    }

    if (isStreaming) {
      return {
        isValid: false,
        response: new Response(JSON.stringify(errorResponse), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
      }
    }

    return {
      isValid: false,
      response: NextResponse.json(errorResponse, { status: 400 }),
    }
  }

  return {
    isValid: true,
    sanitizedMessages,
  }
}
