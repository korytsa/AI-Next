# API Документация

## Endpoints

### POST /api/chat

Основной endpoint для отправки сообщений в чат.

**Request Body:**
```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
  userName?: string
  responseMode?: 'brief' | 'detailed'
  chainOfThought?: 'none' | 'basic' | 'advanced'
  model?: string
  useCache?: boolean
}
```

**Response:**
```typescript
{
  message: {
    role: 'assistant'
    content: string
  }
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
  model?: string
  cached?: boolean
}
```

**Обработка:**
1. Валидация throttle/rate limit
2. Валидация формата сообщений
3. Content moderation
4. Проверка кэша (если useCache=true)
5. Отправка в Groq API
6. Запись метрик
7. Возврат ответа

**Ошибки:**
- `400` - Неверный формат запроса
- `429` - Rate limit exceeded
- `500` - Ошибка сервера

### POST /api/chat/stream

Streaming endpoint для потоковой передачи ответов.

**Request Body:** (аналогично `/api/chat`)

**Response:** Server-Sent Events (SSE)

**Формат событий:**
```
data: {"type": "chunk", "content": "текст"}
data: {"type": "done", "tokens": {...}}
```

**Обработка:**
1. Аналогично `/api/chat`, но с SSE
2. Потоковая передача chunks
3. Завершение с метриками

### GET /api/metrics

Получение метрик использования.

**Query Parameters:**
- `startDate` (optional) - начальная дата
- `endDate` (optional) - конечная дата
- `limit` (optional) - лимит записей

**Response:**
```typescript
{
  metrics: Array<{
    timestamp: string
    tokens: {
      prompt: number
      completion: number
      total: number
    }
    cost: number
    responseTime: number
    model: string
  }>
  totals: {
    tokens: number
    cost: number
    requests: number
  }
}
```

### POST /api/metrics

Запись новой метрики.

**Request Body:**
```typescript
{
  tokens: {
    prompt: number
    completion: number
    total: number
  }
  cost: number
  responseTime: number
  model: string
}
```

### GET /api/errors

Получение списка ошибок.

**Query Parameters:**
- `limit` (optional) - лимит записей
- `severity` (optional) - уровень серьезности

**Response:**
```typescript
{
  errors: Array<{
    id: string
    timestamp: string
    message: string
    stack?: string
    context?: object
    severity: 'error' | 'warning' | 'info'
  }>
}
```

### POST /api/errors

Запись новой ошибки.

**Request Body:**
```typescript
{
  message: string
  stack?: string
  context?: object
  severity?: 'error' | 'warning' | 'info'
}
```

### GET /api/cache

Получение кэшированного ответа.

**Query Parameters:**
- `key` - ключ кэша (hash промпта)

**Response:**
```typescript
{
  cached: boolean
  response?: {
    message: {
      role: 'assistant'
      content: string
    }
    tokens: {...}
  }
}
```

### POST /api/cache

Сохранение ответа в кэш.

**Request Body:**
```typescript
{
  key: string
  response: {
    message: {...}
    tokens: {...}
  }
}
```

### DELETE /api/cache

Очистка кэша.

**Query Parameters:**
- `key` (optional) - конкретный ключ, или все если не указан

## Утилиты

### Rate Limiting

Ограничение частоты запросов на основе IP адреса.

**Лимиты:**
- 60 запросов в минуту
- 1000 запросов в час

**Response при превышении:**
```typescript
{
  error: "Rate limit exceeded"
  retryAfter: number // секунды
}
```

### Throttling

Контроль нагрузки на сервер.

**Механизм:**
- Очередь запросов
- Приоритизация
- Таймауты

### Content Moderation

Проверка контента на недопустимые материалы.

**Проверки:**
- Запрещенные слова
- Токсичный контент
- Спам паттерны

**Response при отклонении:**
```typescript
{
  error: "Content moderation failed"
  reason: string
}
```

### Validation

Валидация входных данных.

**Проверки:**
- Формат сообщений
- Длина промпта
- Типы данных
- Обязательные поля

## Безопасность

### API Key Security

- Ключи хранятся в environment variables
- Валидация при старте
- Маскирование в логах
- Никогда не возвращаются в ответах

### Sanitization

Очистка пользовательского ввода:
- Удаление опасных символов
- Экранирование HTML
- Валидация типов

### Error Handling

- Безопасные сообщения об ошибках
- Логирование без чувствительных данных
- Graceful degradation
