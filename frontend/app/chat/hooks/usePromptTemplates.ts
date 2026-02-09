import { useState } from 'react'
import { getJsonFromStorage, saveJsonToStorage } from '@/app/lib/storage'

export interface PromptTemplate {
  id: string
  name: string
  content: string
  createdAt: number
}

const STORAGE_KEY = 'prompt-templates'
const MAX_TEMPLATES = 20

function getInitialTemplates(): PromptTemplate[] {
  if (typeof window === 'undefined') return []
  const stored = getJsonFromStorage<PromptTemplate[]>(STORAGE_KEY, [])
  return Array.isArray(stored) && stored.length > 0 ? stored : []
}

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>(getInitialTemplates)

  const saveTemplate = (name: string, content: string) => {
    if (!content.trim() || !name.trim()) return false

    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      name: name.trim(),
      content: content.trim(),
      createdAt: Date.now(),
    }

    setTemplates((prev) => {
      const updated = [newTemplate, ...prev].slice(0, MAX_TEMPLATES)
      saveJsonToStorage(STORAGE_KEY, updated)
      return updated
    })

    return true
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      saveJsonToStorage(STORAGE_KEY, updated)
      return updated
    })
  }

  const getTemplate = (id: string): PromptTemplate | undefined => {
    return templates.find((t) => t.id === id)
  }

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    getTemplate,
  }
}
