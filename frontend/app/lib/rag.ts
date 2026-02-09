import { searchMockDocuments, type SearchResult } from '@/app/lib/rag-data'
import { RagPrompt } from '@/app/lib/prompts'

export interface RAGContext {
  documents: SearchResult[]
  formattedContext: string
  enabled: boolean
}

function formatContextForAI(results: SearchResult[]): string {
  if (results.length === 0) return ''

  let context = RagPrompt.SectionStart

  results.forEach((result, index) => {
    const doc = result.document
    const title = doc.metadata?.title || RagPrompt.DocumentTitle(index)
    context += RagPrompt.DocumentLine(index, title)
    context += RagPrompt.ContentLine(doc.content)
  })

  context += RagPrompt.SectionEnd
  context += RagPrompt.UsageRule

  return context
}

export async function retrieveContext(
  query: string,
  maxDocuments: number = 3,
  minScore: number = 0.3
): Promise<RAGContext> {
  try {
    const results = searchMockDocuments(query, maxDocuments, minScore)

    if (results.length === 0) {
      return { documents: [], formattedContext: '', enabled: true }
    }

    return {
      documents: results,
      formattedContext: formatContextForAI(results),
      enabled: true,
    }
  } catch (error) {
    console.error('Error retrieving RAG context:', error)
    return { documents: [], formattedContext: '', enabled: true }
  }
}

