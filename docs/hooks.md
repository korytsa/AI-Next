# Документация хуков

## Основные хуки чата

### useChat
**Расположение:** `app/chat/hooks/useChat.ts`

Главный хук для управления чатом. Объединяет все остальные хуки.

**Возвращает:**
- `messages` - массив сообщений
- `input` - значение поля ввода
- `setInput` - установка значения
- `loading` - состояние загрузки
- `useStreaming` - режим streaming
- `setUseStreaming` - переключение streaming
- `handleSubmit` - отправка сообщения
- `clearHistory` - очистка истории
- `retryLastMessage` - повторная отправка последнего сообщения
- `userName` - имя пользователя
- `handleSetUserName` - установка имени
- `responseMode` - режим ответа
- `handleSetResponseMode` - установка режима
- `exportDialog` - функция открытия диалога экспорта
- `totalTokens` - общее количество токенов
- `chainOfThought` - режим Chain of Thought
- `handleSetChainOfThought` - установка CoT
- `selectedModel` - выбранная модель
- `handleSetSelectedModel` - выбор модели
- `autoPlayVoice` - автовоспроизведение голоса
- `handleSetAutoPlayVoice` - переключение автовоспроизведения
- `loadMoreMessages` - загрузка старых сообщений
- `hasMoreMessages` - есть ли еще сообщения
- `isLoadingMore` - загрузка старых сообщений
- `cancelRequest` - отмена запроса
- `searchQuery` - поисковый запрос
- `setSearchQuery` - установка запроса

### useMessages
**Расположение:** `app/chat/hooks/useMessages.ts`

Управление сообщениями и историей.

**Функции:**
- Сохранение сообщений в localStorage
- Загрузка истории при инициализации
- Очистка истории
- Пагинация для загрузки старых сообщений
- Поиск по истории

### useChatApi
**Расположение:** `app/chat/hooks/useChatApi.ts`

Взаимодействие с API для отправки сообщений.

**Функции:**
- Отправка обычных запросов
- Отправка streaming запросов
- Обработка ответов
- Обработка ошибок
- Отмена запросов

### useSpeechRecognition
**Расположение:** `app/chat/hooks/useSpeechRecognition.ts`

Голосовой ввод через Web Speech API.

**Возвращает:**
- `isListening` - состояние прослушивания
- `isSupported` - поддержка браузером
- `error` - ошибка
- `startListening` - начало прослушивания
- `stopListening` - остановка прослушивания
- `transcript` - распознанный текст

**Особенности:**
- Поддержка русского и английского языков
- Автоматическое определение языка
- Обработка ошибок распознавания

### useSpeechSynthesis
**Расположение:** `app/chat/hooks/useSpeechSynthesis.ts`

Голосовой вывод через Web Speech API.

**Возвращает:**
- `isSpeaking` - состояние воспроизведения
- `isSupported` - поддержка браузером
- `error` - ошибка
- `speak` - воспроизведение текста
- `stop` - остановка воспроизведения

**Особенности:**
- Автоматическое определение языка ответа
- Очистка markdown форматирования
- Глобальная синхронизация состояния
- Автовоспроизведение новых ответов

### useUserSettings
**Расположение:** `app/chat/hooks/useUserSettings.ts`

Управление настройками пользователя.

**Возвращает:**
- `userName` - имя пользователя
- `handleSetUserName` - установка имени
- `responseMode` - режим ответа
- `handleSetResponseMode` - установка режима
- `chainOfThought` - режим Chain of Thought
- `handleSetChainOfThought` - установка CoT
- `selectedModel` - выбранная модель
- `handleSetSelectedModel` - выбор модели
- `autoPlayVoice` - автовоспроизведение голоса
- `handleSetAutoPlayVoice` - переключение автовоспроизведения

**Особенности:**
- Сохранение в localStorage
- Автоматическая загрузка при инициализации

### useExport
**Расположение:** `app/chat/hooks/useExport.ts`

Экспорт истории чата в различные форматы.

**Функции:**
- Экспорт в TXT
- Экспорт в Markdown
- Экспорт в JSON
- Экспорт в PDF

### usePromptTemplates
**Расположение:** `app/chat/hooks/usePromptTemplates.ts`

Управление шаблонами промптов.

**Возвращает:**
- `templates` - массив шаблонов
- `addTemplate` - добавление шаблона
- `updateTemplate` - обновление шаблона
- `deleteTemplate` - удаление шаблона
- `useTemplate` - использование шаблона

**Особенности:**
- Сохранение в localStorage
- Уникальные ID для каждого шаблона

## Утилиты для API

### regularHandler
**Расположение:** `app/chat/hooks/regularHandler.ts`

Обработка обычных (не streaming) запросов.

**Функции:**
- Отправка запроса на `/api/chat`
- Обработка ответа
- Обновление состояния сообщений

### streamingHandler
**Расположение:** `app/chat/hooks/streamingHandler.ts`

Обработка streaming запросов через SSE.

**Функции:**
- Создание SSE соединения
- Обработка потоковых данных
- Обновление UI в реальном времени
- Обработка завершения потока

### chatApiUtils
**Расположение:** `app/chat/hooks/chatApiUtils.ts`

Вспомогательные утилиты для работы с API.

**Функции:**
- Формирование тела запроса
- Обработка ошибок
- Валидация данных
