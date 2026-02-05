# AI + Next.js Learning Project

A minimal project for learning AI integration with Next.js. Start simple and build up gradually.

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
cd frontend && npm install
```

### 2. Set up environment variables

Create `frontend/.env.local`:

```env
GROQ_API_KEY=gsk_your_api_key_here
```

Get your API key at [console.groq.com/keys](https://console.groq.com/keys)

### 3. Run the project

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Project Structure

```
frontend/
├── app/
│   ├── api/
│   │   ├── chat/          # Chat API endpoints
│   │   │   ├── route.ts   # Regular chat endpoint
│   │   │   └── stream/    # Streaming chat endpoint
│   │   └── rag/           # RAG (Retrieval Augmented Generation)
│   │       └── route.ts   # Mock documents and search
│   ├── chat/              # Chat page and components
│   └── page.tsx           # Home page
└── lib/
    ├── openai.ts          # OpenAI/Groq client setup
    ├── rag.ts             # RAG context retrieval
    └── chat-utils.ts      # Chat message preparation
```

## 🎓 Learning Path

1. **Start with the chat** - Understand basic AI integration
2. **Study the API route** - Learn how Next.js API Routes work
3. **Explore the OpenAI client** - Understand API configuration
4. **Try RAG** - Enable RAG in settings and see how it enhances responses
5. **Experiment** - Try different models, parameters, and features

## 🔍 Features

### Chat
- ✅ Regular and streaming responses
- ✅ Message history with localStorage
- ✅ Error handling and retry mechanism
- ✅ Multiple AI models (Groq)
- ✅ Response modes (short/detailed)
- ✅ Chain of Thought reasoning

### RAG (Retrieval Augmented Generation)
- ✅ Knowledge base with 8 mock documents
- ✅ Keyword-based semantic search
- ✅ Relevance scoring (title, tags, content)
- ✅ Context formatting for AI
- ✅ Toggle in chat settings
- ✅ Automatic context injection into system prompt

### Voice
- ✅ Speech recognition (voice input)
- ✅ Text-to-speech (voice output)
- ✅ Auto-playback option
- ✅ Multi-language support

## 📖 Key Files to Study

### Core Chat
- `frontend/app/api/chat/route.ts` - Regular chat API endpoint
- `frontend/app/api/chat/stream/route.ts` - Streaming chat API endpoint
- `frontend/app/chat/page.tsx` - Chat UI
- `frontend/lib/openai.ts` - OpenAI/Groq client setup
- `frontend/lib/chat-utils.ts` - Message preparation and RAG integration

### RAG (Retrieval Augmented Generation)
- `frontend/app/api/rag/route.ts` - Mock documents and search algorithm
- `frontend/lib/rag.ts` - RAG context retrieval and formatting

## 🔒 Security

### API Key Security

- ⚠️ **Never commit `.env.local` files with API keys!**
- ✅ API keys are stored in environment variables only
- ✅ API keys are validated on startup
- ✅ API keys are automatically masked in error logs
- ✅ `.env.local` files are excluded from git via `.gitignore`

### Best Practices

1. **Never hardcode API keys** in source code
2. **Use `.env.local`** for local development (already in `.gitignore`)
3. **Use environment variables** in production (Vercel, etc.)
4. **Rotate keys** if they are accidentally exposed
5. **Use different keys** for development and production

### Environment Variables

- `GROQ_API_KEY` - Your Groq API key (required)
  - Format: `gsk_...`
  - Get it at: [console.groq.com/keys](https://console.groq.com/keys)

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Start simple, learn gradually! 🚀**
