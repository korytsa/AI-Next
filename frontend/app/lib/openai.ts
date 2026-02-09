import OpenAI from 'openai'
import { DEFAULT_MODEL_ID } from './models'
import { ApiString } from './app-strings'

const groqApiKey = process.env.GROQ_API_KEY?.trim() || null

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
