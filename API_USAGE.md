# OpenAI API Usage Guide

## ⚠️ Security Warning

**NEVER share your API key publicly!** If you've exposed it, revoke it immediately:
1. Go to https://platform.openai.com/api-keys
2. Delete the exposed key
3. Create a new one

## ✅ Correct API Usage

### Our Project Uses OpenAI SDK (Recommended)

The project already uses the official OpenAI SDK, which is the correct way:

```typescript
// frontend/lib/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // From .env.local
})
```

### Standard OpenAI API Endpoints

The correct endpoints are:
- **Chat**: `POST https://api.openai.com/v1/chat/completions`
- **Images**: `POST https://api.openai.com/v1/images/generations`
- **Completions**: `POST https://api.openai.com/v1/completions`

### Correct curl Example (for reference)

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Available Models

- `gpt-3.5-turbo` - Fast, cheap, good for most tasks (default in our project)
- `gpt-4` - More capable, more expensive
- `gpt-4-turbo-preview` - Latest GPT-4, most expensive

## 🔧 How Our Project Works

1. **API Key Setup**: Put your key in `frontend/.env.local`
2. **Client Creation**: `lib/openai.ts` creates the OpenAI client
3. **API Route**: `app/api/chat/route.ts` handles requests
4. **Frontend**: `app/chat/page.tsx` sends messages to our API

## 📝 Next Steps

1. Create `frontend/.env.local` with your API key
2. Run `npm install` in frontend directory
3. Start the dev server: `npm run dev`
4. Test the chat!

---

**Remember**: Keep your API key secret! Never commit `.env.local` to git.
