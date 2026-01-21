import { NextRequest, NextResponse } from 'next/server'
import { validateMessages as validateMessagesFormat, createChatCompletion } from '@/app/lib/chat-utils'
import { getErrorStatus, getRetryAfter, getErrorMessage } from '@/app/lib/api-utils'
import { enhanceMessagesWithFunctions } from '@/app/lib/request-detectors'
import { responseCache } from '@/app/lib/cache'
import { checkThrottle } from '@/app/lib/throttle-utils'
import { validateMessages as validatePromptMessages } from '@/app/lib/prompt-validator'
import { moderateMessages } from '@/app/lib/content-moderation'
import { sanitizeMessages } from '@/app/lib/sanitization'
import { sanitizeErrorForLogging } from '@/app/lib/api-key-security'
import { recordMetric } from '@/app/lib/metrics'
import { DEFAULT_MODEL_ID } from '@/app/lib/models'

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let requestTokens = 0
  let responseTokens = 0
  let status: 'success' | 'error' = 'success'
  let selectedModel = DEFAULT_MODEL_ID

  try {
    const throttleCheck = checkThrottle(req)
    if (!throttleCheck.allowed) {
      return throttleCheck.response as NextResponse
    }

    const body = await req.json()
    const { messages, userName, responseMode = 'detailed', chainOfThought = 'none', model, useCache = false } = body
    selectedModel = model || DEFAULT_MODEL_ID

    if (!validateMessagesFormat(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const sanitizedMessages = sanitizeMessages(messages)

    const promptValidation = validatePromptMessages(sanitizedMessages, {
      maxLength: 10000,
      checkInjection: true,
      checkSpecialChars: true,
      checkLength: true,
    })

    if (!promptValidation.isValid) {
      const uniqueErrors = [...new Set(promptValidation.errors)]
      return NextResponse.json(
        { 
          error: uniqueErrors.length === 1 ? uniqueErrors[0] : 'Your request contains content that violates our usage policy',
          details: uniqueErrors,
          type: 'validation_error'
        },
        { status: 400 }
      )
    }

    const moderation = moderateMessages(sanitizedMessages, {
      checkToxicity: true,
      checkProfanity: true,
      checkSpam: true,
      checkPersonalInfo: true,
    })

    if (!moderation.isSafe) {
      const allReasons = moderation.results.flatMap(r => r.reasons)
      const uniqueReasons = [...new Set(allReasons)]
      return NextResponse.json(
        { 
          error: uniqueReasons.length === 1 ? uniqueReasons[0] : 'Your request contains content that violates our usage policy',
          details: uniqueReasons,
          type: 'moderation_error'
        },
        { status: 400 }
      )
    }


    const messagesToSend = await enhanceMessagesWithFunctions(sanitizedMessages)

    if (useCache) {
      const cachedResponse = responseCache.get(messagesToSend, userName, responseMode, chainOfThought)
      if (cachedResponse) {
        return NextResponse.json({
          ...cachedResponse,
          cached: true,
        })
      }
    }

    const completion = await createChatCompletion(messagesToSend, false, userName, responseMode, chainOfThought, undefined, model)

    if ('choices' in completion) {
      const response = {
        message: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
      }

      // Record metrics
      requestTokens = completion.usage?.prompt_tokens || 0
      responseTokens = completion.usage?.completion_tokens || 0
      const duration = Date.now() - startTime
      recordMetric(selectedModel, requestTokens, responseTokens, duration, 'chat', 'success')

      if (useCache) {
        responseCache.set(messagesToSend, response, userName, responseMode, chainOfThought)
      }

      return NextResponse.json({
        ...response,
        cached: false,
      })
    }
    
    throw new Error('Unexpected response type')
  } catch (error: any) {
    status = 'error'
    const duration = Date.now() - startTime
    recordMetric(selectedModel, requestTokens, responseTokens, duration, 'chat', 'error')
    
    console.error('Error in chat API:', sanitizeErrorForLogging(error))
    
    const errorStatus = getErrorStatus(error)
    const retryAfter = getRetryAfter(error)
    const errorMessage = getErrorMessage(error)
    
    const headers: Record<string, string> = {}
    if (retryAfter) {
      headers['retry-after'] = retryAfter.toString()
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: errorStatus, headers }
    )
  }
}
