export interface ModelInfo {
  id: string
  name: string
  contextWindow: number
  description: string
}

export const DEFAULT_MODEL_ID = 'llama-3.1-8b-instant'

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    contextWindow: 8192,
    description: 'Fast, good quality (~8K tokens)',
  },
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    contextWindow: 8192,
    description: 'Latest, high quality (~8K tokens)',
  },
]

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === modelId)
}

