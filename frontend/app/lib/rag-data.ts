const STOP_WORDS = new Set(['what', 'is', 'are', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'how', 'why', 'when', 'where', 'who', 'which', 'that', 'this', 'these', 'those'])

export interface Document {
  id: string
  content: string
  metadata?: {
    title?: string
    source?: string
    createdAt?: string
    tags?: string[]
    [key: string]: any
  }
}

export interface SearchResult {
  document: Document
  score: number
}

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc_1',
    content: 'Next.js is a React framework for production. It provides features like server-side rendering, static site generation, and API routes. Next.js makes it easy to build full-stack React applications with built-in routing, image optimization, and automatic code splitting.',
    metadata: {
      title: 'Next.js Overview',
      source: 'Next.js Documentation',
      createdAt: '2024-01-15T10:00:00Z',
      tags: ['nextjs', 'react', 'framework'],
    },
  },
  {
    id: 'doc_2',
    content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds static type definitions to JavaScript, which helps catch errors during development. TypeScript supports modern JavaScript features and provides excellent tooling support.',
    metadata: {
      title: 'TypeScript Introduction',
      source: 'TypeScript Handbook',
      createdAt: '2024-01-16T10:00:00Z',
      tags: ['typescript', 'javascript', 'programming'],
    },
  },
  {
    id: 'doc_3',
    content: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture where UI is broken down into reusable components. React uses a virtual DOM for efficient updates and supports hooks for state management and side effects.',
    metadata: {
      title: 'React Fundamentals',
      source: 'React Documentation',
      createdAt: '2024-01-17T10:00:00Z',
      tags: ['react', 'javascript', 'ui'],
    },
  },
  {
    id: 'doc_4',
    content: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs. Instead of writing custom CSS, you compose utility classes to create your design. Tailwind is highly customizable and works well with modern build tools.',
    metadata: {
      title: 'Tailwind CSS Guide',
      source: 'Tailwind CSS Documentation',
      createdAt: '2024-01-18T10:00:00Z',
      tags: ['tailwind', 'css', 'styling'],
    },
  },
  {
    id: 'doc_5',
    content: 'RAG (Retrieval Augmented Generation) is a technique that enhances AI responses by retrieving relevant information from a knowledge base before generating a response. It combines information retrieval with language generation to provide more accurate and contextually relevant answers.',
    metadata: {
      title: 'RAG Technique Explained',
      source: 'AI Research Papers',
      createdAt: '2024-01-19T10:00:00Z',
      tags: ['rag', 'ai', 'nlp'],
    },
  },
  {
    id: 'doc_6',
    content: 'Embeddings are vector representations of text that capture semantic meaning. Similar texts have similar embeddings, allowing for semantic search. Embeddings are typically generated using neural networks trained on large text corpora and can be used for similarity search, clustering, and classification tasks.',
    metadata: {
      title: 'Text Embeddings Overview',
      source: 'ML Documentation',
      createdAt: '2024-01-20T10:00:00Z',
      tags: ['embeddings', 'ml', 'nlp'],
    },
  },
  {
    id: 'doc_7',
    content: 'API routes in Next.js allow you to create backend endpoints within your Next.js application. They are serverless functions that handle HTTP requests. API routes are perfect for handling form submissions, database operations, and integrating with third-party APIs.',
    metadata: {
      title: 'Next.js API Routes',
      source: 'Next.js Documentation',
      createdAt: '2024-01-21T10:00:00Z',
      tags: ['nextjs', 'api', 'backend'],
    },
  },
  {
    id: 'doc_8',
    content: 'Server-Sent Events (SSE) is a technology that allows a server to push data to a client over a single HTTP connection. Unlike WebSockets, SSE is unidirectional (server to client) and works over standard HTTP. SSE is perfect for real-time updates, notifications, and streaming data.',
    metadata: {
      title: 'Server-Sent Events',
      source: 'Web Standards',
      createdAt: '2024-01-22T10:00:00Z',
      tags: ['sse', 'streaming', 'real-time'],
    },
  },
]

export function searchMockDocuments(
  query: string,
  limit: number = 5,
  minScore: number = 0.3
): SearchResult[] {
  const cleanedQuery = query.toLowerCase().trim().replace(/[?!.,;:]/g, ' ')
  if (!cleanedQuery) return []

  let queryWords = cleanedQuery.split(/\s+/).filter(w => w.length > 0)
  queryWords = queryWords.filter(word => !STOP_WORDS.has(word) && word.length >= 2)
  
  if (queryWords.length === 0) return []

  const results = MOCK_DOCUMENTS.map(doc => {
    const contentLower = doc.content.toLowerCase()
    const titleLower = doc.metadata?.title?.toLowerCase() || ''
    const tagsLower = doc.metadata?.tags?.join(' ').toLowerCase() || ''

    let score = 0
    let matchedWords = 0
    const importantWords: string[] = []

    for (const word of queryWords) {
      const cleanWord = word.replace(/[?!.,;:]/g, '').trim()
      if (cleanWord.length < 2) continue
      
      let wordScore = 0
      
      if (titleLower.includes(cleanWord)) {
        wordScore = Math.max(wordScore, 0.7)
        importantWords.push(cleanWord)
      }
      if (contentLower.includes(cleanWord)) {
        wordScore = Math.max(wordScore, 0.5)
      }
      if (tagsLower.includes(cleanWord)) {
        wordScore = Math.max(wordScore, 0.6)
      }
      
      if (wordScore > 0) {
        score += wordScore
        matchedWords++
      }
    }

    if (matchedWords > 0) {
      const meaningfulWordsCount = queryWords.filter(w => w.replace(/[?!.,;:]/g, '').trim().length >= 2).length
      score = score / Math.max(meaningfulWordsCount, 1)
      
      if (matchedWords === meaningfulWordsCount) {
        score = Math.min(score * 1.4, 1.0)
      }
      if (importantWords.length > 0) {
        score = Math.min(score * 1.3, 1.0)
      }
    }

    return { document: doc, score }
  })
    .filter(result => result.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  return results
}
