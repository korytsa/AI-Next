import { useState, useEffect } from 'react'

export interface PromptTemplate {
  id: string
  name: string
  content: string
  createdAt: number
}

const STORAGE_KEY = 'prompt-templates'
const MAX_TEMPLATES = 20

export function usePromptTemplates() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTemplates(JSON.parse(stored))
      } catch {
        setTemplates([])
      }
    }
  }, [])

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })

    return true
  }

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
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
