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
│   │   └── chat/          # Chat API endpoint
│   ├── chat/              # Chat page
│   └── page.tsx           # Home page
└── lib/
    └── openai.ts          # OpenAI client setup
```

## 🎓 Learning Path

1. **Start with the chat** - Understand basic AI integration
2. **Study the API route** - Learn how Next.js API Routes work
3. **Explore the OpenAI client** - Understand API configuration
4. **Experiment** - Try different models and parameters

## 📖 Key Files to Study

- `frontend/app/api/chat/route.ts` - API endpoint
- `frontend/app/chat/page.tsx` - Chat UI
- `frontend/lib/openai.ts` - OpenAI setup

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
