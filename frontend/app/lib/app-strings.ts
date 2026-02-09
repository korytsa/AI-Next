export const ErrorType = {
  RateLimit: 'rate_limit',
  Network: 'network',
  Server: 'server',
  ValidationError: 'validation_error',
  ModerationError: 'moderation_error',
  Unknown: 'unknown',
} as const

export type ErrorTypeValue = (typeof ErrorType)[keyof typeof ErrorType]

export const ErrorMessage = {
  ValidationPolicy: 'Your request contains content that violates our usage policy',
  ValidationInvalidContent: 'Your request contains invalid content',
  InvalidRequest: 'Invalid request. Please check your input.',
  RateLimit: 'Too many requests. Please wait a moment and try again.',
  RateLimitThrottle: 'Too many requests. Please wait before sending another message.',
  Network: 'Network error. Please check your internet connection and try again.',
  Server: 'Server error. Please try again in a moment.',
  Unexpected: 'An unexpected error occurred. Please try again.',
  Unknown: 'Unknown error',
  FailedToGetResponse: 'Failed to get AI response',
  InvalidApiKey: 'Invalid API key. Please check your configuration.',
  ApiKeyMissingOrInvalid:
    'API key is missing or invalid. Please check your environment variables.',
} as const

export const SpeechError = {
  NoSpeech: 'No speech detected. Please try again.',
  AudioCapture: 'No microphone found. Please check your microphone.',
  NotAllowed: 'Microphone permission denied. Please allow microphone access.',
  Network: 'Network error. Please check your connection.',
  FailedToStart: 'Failed to start speech recognition',
  NotSupported: 'Speech recognition is not supported in your browser',
  Generic: (code: string) => `Speech recognition error: ${code}`,
} as const

export const ValidationMessage = {
  IgnoreInstructions: 'Attempting to ignore system instructions is not allowed',
  OverrideInstructions: 'Attempting to override system instructions is not allowed',
  RequestInstructions: 'Requesting system instructions is not allowed',
  ChangeRole: "Attempting to change the assistant's role or behavior is not allowed",
  ExecuteCommands: 'Attempting to execute commands is not allowed',
  InvalidSystemCommand: 'Invalid system command detected',
  InvalidSystemMarkers: 'Invalid system markers detected',
  TranslationNotAllowed: 'Translation requests that may hide malicious content are not allowed',
  EncodingNotAllowed: 'Encoding/decoding requests are not allowed',
  SensitiveInfoNotAllowed: 'Requesting sensitive information is not allowed',
  UnsafeCharacters: 'Potentially unsafe characters detected in your message',
  MessageTooLong: (maxLength: number) =>
    `Your message is too long. Maximum length is ${maxLength.toLocaleString()} characters.`,
  InvalidFormat: 'Invalid message format',
  PleaseEnterMessage: 'Please enter a message',
} as const

export const ApiString = {
  AnonymousClientId: 'anonymous',
  ContentTypeJson: 'application/json',
  HeaderRetryAfter: 'retry-after',
  HeaderRetryAfterAlt: 'Retry-After',
  HeaderXClientId: 'x-client-id',
  HeaderXRateLimitLimit: 'X-RateLimit-Limit',
  HeaderXRateLimitRemaining: 'X-RateLimit-Remaining',
  MethodPost: 'POST',
  GroqKeyNotSet:
    'GROQ_API_KEY is not set in environment variables. ' +
    'Please create frontend/.env.local file with: GROQ_API_KEY=your_api_key_here',
  FailedToLoadApiKey: (msg: string) =>
    `Failed to load API key: ${msg}. Please check your frontend/.env.local file.`,
  ExportPdfPopup: 'Please allow popups to export as PDF',
} as const

export const ApiKeyError = {
  InvalidFormat: 'Invalid API key format. Groq API keys should start with "gsk_"',
} as const

export const ModerationMessage = {
  PleaseEnterMessage: 'Please enter a message',
  InappropriateLanguage: 'Your message contains inappropriate language',
  SensitiveInfo:
    'Your message may contain sensitive personal information. Please do not share credit card numbers, social security numbers, or passwords.',
  Spam: 'Your message appears to be spam or promotional content',
  Prohibited: 'Your message contains prohibited content',
} as const
