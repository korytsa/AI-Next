import { getErrorStatus, getRetryAfter, getErrorMessage } from './api-utils'
import { ErrorType, type ErrorTypeValue } from './app-strings'
import { recordMetric } from './metrics'
import { trackError } from './errors'

interface RecordErrorParams {
  error: any
  endpoint: string
  selectedModel: string
  requestTokens: number
  responseTokens: number
  startTime: number
  endpointType: 'chat' | 'stream'
}

interface ErrorResponseData {
  error: string
  type: ErrorTypeValue
  retryAfter?: number
  details?: string
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

export function createErrorResponseData(
  error: any,
  status: number,
  defaultMessage?: string
): { errorData: ErrorResponseData; retryAfter?: number } {
  const retryAfter = getRetryAfter(error)
  const errorMessage = getErrorMessage(error, defaultMessage)
  
  const errorData: ErrorResponseData = {
    error: errorMessage,
    type: status === 429 ? ErrorType.RateLimit : ErrorType.Server,
    details: String(error?.message ?? ''),
  }
  if (retryAfter) errorData.retryAfter = retryAfter

  return { errorData, retryAfter }
}
