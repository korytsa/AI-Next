import { NextRequest } from 'next/server'
import { validateMessages as validateMessagesFormat, createChatCompletion } from '@/app/lib/chat-utils'
import { getErrorStatus, getRetryAfter, getErrorMessage } from '@/app/lib/api-utils'
import { enhanceMessagesWithFunctions } from '@/app/lib/request-detectors'
import { checkThrottle } from '@/app/lib/throttle-utils'
import { validateMessages as validatePromptMessages } from '@/app/lib/prompt-validator'
import { moderateMessages } from '@/app/lib/content-moderation'
import { sanitizeErrorForLogging } from '@/app/lib/api-key-security'

export async function POST(req: NextRequest) {
  try {
    const throttleCheck = checkThrottle(req)
    if (!throttleCheck.allowed) {
      return throttleCheck.response as Response
    }

    const { messages, userName, responseMode = 'detailed', chainOfThought = 'none' } = await req.json()

    if (!validateMessagesFormat(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const promptValidation = validatePromptMessages(messages, {
      maxLength: 10000,
      checkInjection: true,
      checkSpecialChars: true,
      checkLength: true,
    })

    if (!promptValidation.isValid) {
      const uniqueErrors = [...new Set(promptValidation.errors)]
      return new Response(
        JSON.stringify({ 
          error: uniqueErrors.length === 1 ? uniqueErrors[0] : 'Your request contains content that violates our usage policy',
          details: uniqueErrors,
          type: 'validation_error'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const moderation = moderateMessages(messages, {
      checkToxicity: true,
      checkProfanity: true,
      checkSpam: true,
      checkPersonalInfo: true,
    })

    if (!moderation.isSafe) {
      const allReasons = moderation.results.flatMap(r => r.reasons)
      const uniqueReasons = [...new Set(allReasons)]
      return new Response(
        JSON.stringify({ 
          error: uniqueReasons.length === 1 ? uniqueReasons[0] : 'Your request contains content that violates our usage policy',
          details: uniqueReasons,
          type: 'moderation_error'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }


    const messagesToSend = await enhanceMessagesWithFunctions(messages)
    const stream = (await createChatCompletion(messagesToSend, true, userName, responseMode, chainOfThought)) as AsyncIterable<any>

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
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ usage })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error: any) {
          const status = getErrorStatus(error)
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
    console.error('Error in streaming chat API:', sanitizeErrorForLogging(error))
    
    const status = getErrorStatus(error)
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
