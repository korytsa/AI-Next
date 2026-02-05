import { searchMockDocuments, type SearchResult } from '@/app/api/rag/route'

export interface RAGContext {
  documents: SearchResult[]
  formattedContext: string
  enabled: boolean
}

function formatContextForAI(results: SearchResult[]): string {
  if (results.length === 0) return ''

  let context = '\n\n=== KNOWLEDGE BASE - EXACT INFORMATION TO USE ===\n\n'

  results.forEach((result, index) => {
    const doc = result.document
    const title = doc.metadata?.title || `Document ${index + 1}`
    
    context += `[Document ${index + 1}] ${title}\n`
    context += `Content: ${doc.content}\n\n`
  })

  context += '=== END OF KNOWLEDGE BASE ===\n\n'
  context += 'Use the EXACT information from the knowledge base above to answer. Do not rephrase - use it as provided. Only use your general knowledge if the knowledge base doesn\'t contain relevant information.\n'

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

