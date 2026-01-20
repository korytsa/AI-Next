import OpenAI from 'openai'
import { getApiKeyFromEnv, maskApiKey } from './api-key-security'
import { DEFAULT_MODEL_ID } from './models'

let groqApiKey: string | null = null

try {
  groqApiKey = getApiKeyFromEnv()
} catch (error: any) {
  const errorMessage = error?.message || 'Unknown error'
  throw new Error(`Failed to load API key: ${errorMessage}. Please check your frontend/.env.local file.`)
}

if (!groqApiKey) {
  throw new Error(
    'GROQ_API_KEY is not set in environment variables. ' +
    'Please create frontend/.env.local file with: GROQ_API_KEY=your_api_key_here'
  )
}

export const openai = new OpenAI({
  apiKey: groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
})


export const DEFAULT_MODEL = DEFAULT_MODEL_ID
export const DEFAULT_TEMPERATURE = 0.5              
export const DEFAULT_MAX_TOKENS = 2000
export { AVAILABLE_MODELS, getModelInfo, type ModelInfo } from './models'
