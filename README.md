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
OPENAI_API_KEY=your_openai_api_key_here
```

Get your API key at [platform.openai.com](https://platform.openai.com/api-keys)

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

⚠️ Never commit `.env.local` files with API keys!

## 📚 Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

---

**Start simple, learn gradually! 🚀**
