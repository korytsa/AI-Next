# Архитектура проекта AI Chat Application

## Обзор

AI Chat Application построен на Next.js 14 с использованием App Router, TypeScript и Tailwind CSS. Приложение предоставляет полнофункциональный интерфейс для общения с AI через Groq API.

## Структура проекта

```
frontend/
├── app/
│   ├── api/                    # API Routes
│   │   ├── cache/              # Кэширование ответов
│   │   ├── chat/              # Основной endpoint чата
│   │   │   └── stream/        # Streaming endpoint
│   │   ├── errors/            # Error tracking endpoint
│   │   └── metrics/           # Метрики endpoint
│   ├── chat/                  # Страница чата
│   │   ├── components/        # Компоненты чата
│   │   ├── hooks/             # Custom hooks
│   │   ├── page.tsx           # Главная страница чата
│   │   └── types.ts           # TypeScript типы
│   ├── errors/                # Страница ошибок
│   ├── metrics/               # Страница метрик
│   ├── components/            # Общие компоненты
│   ├── contexts/              # React Contexts
│   ├── lib/                   # Утилиты и хелперы
│   └── globals.css            # Глобальные стили
├── public/                    # Статические файлы
└── package.json
```

## Основные компоненты

### Frontend Components

#### Chat Components (`app/chat/components/`)
- **ChatPage** - Главная страница чата
- **ChatHeader** - Шапка с настройками и управлением
- **MessagesList** - Список сообщений
- **MessageBubble** - Отдельное сообщение
- **ChatInput** - Поле ввода с кнопками
- **ChatSettingsPanel** - Панель настроек
- **PromptTemplates** - Шаблоны промптов
- **LoadingIndicator** - Индикатор загрузки
- **UserNameBadge** - Бейдж с именем пользователя

### Custom Hooks (`app/chat/hooks/`)

- **useChat** - Главный хук для управления чатом
- **useMessages** - Управление сообщениями
- **useChatApi** - API взаимодействие
- **useSpeechRecognition** - Голосовой ввод
- **useSpeechSynthesis** - Голосовой вывод
- **useUserSettings** - Настройки пользователя
- **useExport** - Экспорт истории
- **usePromptTemplates** - Шаблоны промптов
- **regularHandler** - Обработка обычных запросов
- **streamingHandler** - Обработка streaming запросов
- **chatApiUtils** - Утилиты для API

### Utility Libraries (`app/lib/`)

- **chat-utils.ts** - Утилиты для чата (создание промптов, валидация)
- **openai.ts** - Клиент Groq API
- **api-utils.ts** - Утилиты для API
- **cache.ts** - Кэширование ответов
- **metrics.ts** - Метрики использования
- **error-tracker.ts** - Отслеживание ошибок
- **error-handler.ts** - Обработка ошибок
- **api-error-handler.ts** - Обработка API ошибок
- **request-validation.ts** - Валидация запросов
- **request-throttler.ts** - Throttling запросов
- **request-detectors.ts** - Определение необходимости функций
- **content-moderation.ts** - Модерация контента
- **prompt-validator.ts** - Валидация промптов
- **sanitization.ts** - Очистка входных данных
- **api-key-security.ts** - Безопасность API ключей
- **message-trimming.ts** - Обрезка истории
- **message-summarization.ts** - Суммаризация сообщений
- **chain-of-thought.ts** - Chain of Thought промпты
- **few-shot-examples.ts** - Few-shot примеры
- **functions.ts** - Function calling функции
- **export-formats.ts** - Экспорт в разные форматы
- **storage.ts** - Работа с localStorage
- **throttle-utils.ts** - Утилиты throttling
- **translations.ts** - Переводы интерфейса
- **models.ts** - Модели AI
- **utils.ts** - Общие утилиты

## API Routes

### `/api/chat` (POST)
Основной endpoint для чата. Обрабатывает запросы к AI, валидирует входные данные, применяет модерацию, кэширование и возвращает ответ.

### `/api/chat/stream` (POST)
Streaming endpoint для потоковой передачи ответов через Server-Sent Events (SSE).

### `/api/metrics` (GET, POST)
Получение и запись метрик использования (токены, стоимость, время ответа).

### `/api/errors` (GET, POST)
Получение и запись ошибок приложения.

### `/api/cache` (GET, POST, DELETE)
Управление кэшем ответов.

## Потоки данных

### Отправка сообщения
1. Пользователь вводит сообщение
2. `ChatInput` вызывает `handleSubmit` из `useChat`
3. `useChat` вызывает `useChatApi` для отправки запроса
4. Запрос идет на `/api/chat` или `/api/chat/stream`
5. API route обрабатывает запрос, валидирует, применяет модерацию
6. Запрос отправляется в Groq API
7. Ответ возвращается и обновляет состояние через `useMessages`
8. UI обновляется с новым сообщением

### Streaming ответ
1. Пользователь включает streaming режим
2. Запрос идет на `/api/chat/stream`
3. API route создает SSE соединение
4. Ответы приходят частями через SSE
5. `streamingHandler` обрабатывает каждую часть
6. UI обновляется в реальном времени

### Голосовой ввод
1. Пользователь нажимает кнопку микрофона
2. `useSpeechRecognition` активирует Web Speech API
3. Речь распознается и преобразуется в текст
4. Текст вставляется в поле ввода
5. Пользователь отправляет сообщение как обычно

### Голосовой вывод
1. При получении ответа от AI проверяется настройка `autoPlayVoice`
2. Если включено, `useSpeechSynthesis` получает текст ответа
3. Текст очищается от markdown форматирования
4. Определяется язык ответа
5. Web Speech API озвучивает текст

## Состояние приложения

### Глобальное состояние
- **LanguageContext** - Язык интерфейса (ru/en)
- **useUserSettings** - Настройки пользователя (localStorage)
- **useMessages** - История сообщений (localStorage)

### Локальное состояние
- Каждый компонент управляет своим локальным состоянием через React hooks
- Состояние загрузки, ошибок, UI состояния

## Безопасность

### API Key Security
- Ключи хранятся только в environment variables
- Валидация ключей при старте
- Маскирование ключей в логах
- `.env.local` исключен из git

### Content Moderation
- Проверка промптов на недопустимый контент
- Валидация входных данных
- Sanitization пользовательского ввода

### Rate Limiting & Throttling
- Ограничение частоты запросов
- Контроль нагрузки на сервер
- Защита от злоупотреблений

## Оптимизация

### Кэширование
- Кэширование ответов для повторяющихся запросов
- Экономия токенов и API вызовов

### Message Optimization
- Обрезка длинной истории
- Суммаризация старых сообщений
- Пагинация для загрузки истории

### Performance
- Streaming для быстрого отображения ответов
- Ленивая загрузка компонентов
- Оптимизация рендеринга

## Технологии

- **Next.js 14** - React framework с App Router
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Groq API** - AI модели
- **Web Speech API** - Голосовой ввод/вывод
- **React Hooks** - Управление состоянием
- **localStorage** - Хранение данных (временно)
