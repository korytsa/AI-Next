import { NextResponse } from 'next/server'
import { validateMessages as validatePromptMessages } from './prompt-validator'
import { moderateMessages } from './content-moderation'
import { sanitizeMessages } from './sanitization'
import { trackError } from './error-tracker'

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
    const validationError = new Error(
      uniqueErrors.length === 1 ? uniqueErrors[0] : 'Your request contains content that violates our usage policy'
    )
    validationError.name = 'ValidationError'

    trackError(validationError, {
      endpoint,
      method: 'POST',
      statusCode: 400,
      type: 'validation_error',
      model: selectedModel,
      details: uniqueErrors,
    })

    const errorResponse = {
      error: uniqueErrors.length === 1 ? uniqueErrors[0] : 'Your request contains content that violates our usage policy',
      details: uniqueErrors,
      type: 'validation_error',
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

    const moderationError = new Error(
      uniqueReasons.length === 1 ? uniqueReasons[0] : 'Your request contains content that violates our usage policy'
    )
    moderationError.name = 'ModerationError'

    trackError(moderationError, {
      endpoint,
      method: 'POST',
      statusCode: 400,
      type: 'moderation_error',
      model: selectedModel,
      reasons: uniqueReasons,
    })

    const errorResponse = {
      error: uniqueReasons.length === 1 ? uniqueReasons[0] : 'Your request contains content that violates our usage policy',
      details: uniqueReasons,
      type: 'moderation_error',
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
