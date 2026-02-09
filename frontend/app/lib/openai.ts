import OpenAI from 'openai'
import { getApiKeyFromEnv } from './api-key-security'
import { DEFAULT_MODEL_ID } from './models'
import { ErrorMessage, ApiString } from './app-strings'

let groqApiKey: string | null = null

try {
  groqApiKey = getApiKeyFromEnv()
} catch (error: any) {
  const errorMessage = error?.message || ErrorMessage.Unknown
  throw new Error(ApiString.FailedToLoadApiKey(errorMessage))
}

if (!groqApiKey) {
  throw new Error(ApiString.GroqKeyNotSet)
}

export const openai = new OpenAI({
  apiKey: groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
})


export const DEFAULT_MODEL = DEFAULT_MODEL_ID
export const DEFAULT_TEMPERATURE = 0.5              
export const DEFAULT_MAX_TOKENS = 2000
export { AVAILABLE_MODELS, getModelInfo, type ModelInfo } from './models'
