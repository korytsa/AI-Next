import { NextRequest, NextResponse } from 'next/server'
import { validateMessages as validateMessagesFormat, createChatCompletion } from '@/app/lib/chat-utils'
import { enhanceMessagesWithFunctions } from '@/app/lib/request-detectors'
import { responseCache } from '@/app/lib/cache'
import { checkThrottle } from '@/app/lib/throttle-utils'
import { validateAndModerateRequest } from '@/app/lib/request-validation'
import { sanitizeErrorForLogging } from '@/app/lib/api-key-security'
import { recordMetric } from '@/app/lib/metrics'
import { DEFAULT_MODEL_ID } from '@/app/lib/models'
import { recordApiError, createErrorResponseData } from '@/app/lib/api-error-handler'

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let requestTokens = 0
  let responseTokens = 0
  let selectedModel = DEFAULT_MODEL_ID

  try {
    const throttleCheck = checkThrottle(req)
    if (!throttleCheck.allowed) {
      return throttleCheck.response as NextResponse
    }

    const body = await req.json()
    const { messages, userName, responseMode = 'detailed', chainOfThought = 'none', model, useCache = false, useRAG = false, ragMaxDocuments = 3 } = body
    selectedModel = model || DEFAULT_MODEL_ID

    if (!validateMessagesFormat(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const validation = await validateAndModerateRequest(messages, '/api/chat', selectedModel, false)
    if (!validation.isValid) {
      return validation.response as NextResponse
    }

    const messagesToSend = await enhanceMessagesWithFunctions(validation.sanitizedMessages!)

    if (useCache) {
      const cachedResponse = responseCache.get(messagesToSend, userName, responseMode, chainOfThought)
      if (cachedResponse) {
        return NextResponse.json({
          ...cachedResponse,
          cached: true,
        })
      }
    }

    const completion = await createChatCompletion(messagesToSend, false, userName, responseMode, chainOfThought, undefined, model, useRAG, ragMaxDocuments)

    if ('choices' in completion) {
      const response = {
        message: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
      }

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
    const status = recordApiError({
      error,
      endpoint: '/api/chat',
      selectedModel,
      requestTokens,
      responseTokens,
      startTime,
      endpointType: 'chat',
    })
    
    console.error('Error in chat API:', sanitizeErrorForLogging(error))
    
    const { errorData, retryAfter } = createErrorResponseData(error, status)
    const headers: Record<string, string> = {}
    if (retryAfter) {
      headers['retry-after'] = retryAfter.toString()
    }
    
    return NextResponse.json(errorData, { status, headers })
  }
}
