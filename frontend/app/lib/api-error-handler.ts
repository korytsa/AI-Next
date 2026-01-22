import { getErrorStatus, getRetryAfter, getErrorMessage } from './api-utils'
import { recordMetric } from './metrics'
import { trackError } from './error-tracker'

interface RecordErrorParams {
  error: any
  endpoint: string
  selectedModel: string
  requestTokens: number
  responseTokens: number
  startTime: number
  endpointType: 'chat' | 'stream'
}

export function recordApiError(params: RecordErrorParams) {
  const { error, endpoint, selectedModel, requestTokens, responseTokens, startTime, endpointType } = params
  
  const duration = Date.now() - startTime
  recordMetric(selectedModel, requestTokens, responseTokens, duration, endpointType, 'error')
  
  const status = getErrorStatus(error)
  trackError(error, {
    endpoint,
    method: 'POST',
    statusCode: status,
    model: selectedModel,
    requestTokens,
    responseTokens,
  })
  
  return status
}

export function createErrorResponseData(error: any, status: number, defaultMessage?: string) {
  const retryAfter = getRetryAfter(error)
  const errorMessage = getErrorMessage(error, defaultMessage)
  
  const errorData: any = {
    error: errorMessage,
    type: status === 429 ? 'rate_limit' : 'server',
  }
  
  if (retryAfter) errorData.retryAfter = retryAfter
  if (process.env.NODE_ENV === 'development') {
    errorData.details = error?.message
  }
  
  return { errorData, retryAfter }
}
