import { NextRequest } from 'next/server'
import { validateMessages as validateMessagesFormat, createChatCompletion } from '@/app/lib/chat-utils'
import { getErrorStatus, getRetryAfter, getErrorMessage } from '@/app/lib/api-utils'
import { enhanceMessagesWithFunctions } from '@/app/lib/request-detectors'
import { checkThrottle } from '@/app/lib/throttle-utils'
import { validateAndModerateRequest } from '@/app/lib/request-validation'
import { sanitizeErrorForLogging } from '@/app/lib/api-key-security'
import { recordMetric } from '@/app/lib/metrics'
import { DEFAULT_MODEL_ID } from '@/app/lib/models'
import { trackError } from '@/app/lib/error-tracker'

export async function POST(req: NextRequest) {
  const startTime = Date.now()
  let requestTokens = 0
  let responseTokens = 0
  let selectedModel = DEFAULT_MODEL_ID

  try {
    const throttleCheck = checkThrottle(req)
    if (!throttleCheck.allowed) {
      return throttleCheck.response as Response
    }

    const { messages, userName, responseMode = 'detailed', chainOfThought = 'none', model } = await req.json()
    selectedModel = model || DEFAULT_MODEL_ID

    if (!validateMessagesFormat(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const validation = await validateAndModerateRequest(messages, '/api/chat/stream', selectedModel, true)
    if (!validation.isValid) {
      return validation.response as Response
    }

    const messagesToSend = await enhanceMessagesWithFunctions(validation.sanitizedMessages!)
    const stream = (await createChatCompletion(messagesToSend, true, userName, responseMode, chainOfThought, undefined, model)) as AsyncIterable<any>

    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          let usage: any = null
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
            if (chunk.usage) {
              usage = chunk.usage
            }
          }
          if (usage) {
            requestTokens = usage.prompt_tokens || 0
            responseTokens = usage.completion_tokens || 0
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ usage })}\n\n`))
          }
          
          // Always record metrics, even if usage is not available
          const duration = Date.now() - startTime
          recordMetric(selectedModel, requestTokens, responseTokens, duration, 'stream', 'success')
          
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error: any) {
          const duration = Date.now() - startTime
          recordMetric(selectedModel, requestTokens, responseTokens, duration, 'stream', 'error')
          
          const status = getErrorStatus(error)
          trackError(error, {
            endpoint: '/api/chat/stream',
            method: 'POST',
            statusCode: status,
            model: selectedModel,
            requestTokens,
            responseTokens,
          })
          
          const retryAfter = getRetryAfter(error)
          const errorMessage = getErrorMessage(error, 'Failed to stream AI response')
          
          const errorData: any = { error: errorMessage, type: status === 429 ? 'rate_limit' : 'server' }
          if (retryAfter) {
            errorData.retryAfter = retryAfter
          }
          
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    const duration = Date.now() - startTime
    recordMetric(selectedModel, requestTokens, responseTokens, duration, 'stream', 'error')
    
    const status = getErrorStatus(error)
    trackError(error, {
      endpoint: '/api/chat/stream',
      method: 'POST',
      statusCode: status,
      model: selectedModel,
      requestTokens,
      responseTokens,
    })
    
    console.error('Error in streaming chat API:', sanitizeErrorForLogging(error))
    
    const retryAfter = getRetryAfter(error)
    const errorMessage = getErrorMessage(error, 'Failed to stream AI response')
    
    const errorData: any = { 
      error: errorMessage, 
      type: status === 429 ? 'rate_limit' : 'server',
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    }
    if (retryAfter) {
      errorData.retryAfter = retryAfter
    }
    
    return new Response(
      JSON.stringify(errorData),
      { 
        status, 
        headers: { 
          'Content-Type': 'application/json',
          ...(retryAfter ? { 'retry-after': retryAfter.toString() } : {})
        } 
      }
    )
  }
}
