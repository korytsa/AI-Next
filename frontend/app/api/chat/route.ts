import { NextRequest, NextResponse } from 'next/server'
import { validateMessages, createChatCompletion } from '@/app/lib/chat-utils'
import { getErrorStatus, getRetryAfter, getErrorMessage } from '@/app/lib/api-utils'
import { enhanceMessagesWithFunctions } from '@/app/lib/request-detectors'
import { responseCache } from '@/app/lib/cache'

export async function POST(req: NextRequest) {
  try {
    const { messages, userName, responseMode = 'detailed', chainOfThought = 'none', useCache = false } = await req.json()

    if (!validateMessages(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const messagesToSend = await enhanceMessagesWithFunctions(messages)

    if (useCache) {
      const cachedResponse = responseCache.get(messagesToSend, userName, responseMode, chainOfThought)
      if (cachedResponse) {
        return NextResponse.json({
          ...cachedResponse,
          cached: true,
        })
      }
    }

    const completion = await createChatCompletion(messagesToSend, false, userName, responseMode, chainOfThought)

    if ('choices' in completion) {
      const response = {
        message: completion.choices[0]?.message?.content || '',
        usage: completion.usage,
      }

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
    console.error('Error in chat API:', error)
    
    const status = getErrorStatus(error)
    const retryAfter = getRetryAfter(error)
    const errorMessage = getErrorMessage(error)
    
    const headers: Record<string, string> = {}
    if (retryAfter) {
      headers['retry-after'] = retryAfter.toString()
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status, headers }
    )
  }
}
