import OpenAI from 'openai'

const groqApiKey = process.env.GROQ_API_KEY

if (!groqApiKey) {
  throw new Error('GROQ_API_KEY is not set in environment variables. Please set it in frontend/.env.local')
}

export const openai = new OpenAI({
  apiKey: groqApiKey,
  baseURL: 'https://api.groq.com/openai/v1',
})

export const DEFAULT_MODEL = 'llama-3.1-8b-instant'
export const DEFAULT_TEMPERATURE = 0.5              
export const DEFAULT_MAX_TOKENS = 2000
