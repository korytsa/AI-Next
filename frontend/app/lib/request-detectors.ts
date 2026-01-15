import { getCurrentDateTime } from './functions'

export function detectDateTimeRequest(messages: any[]): string | null {
  const lastMessage = messages[messages.length - 1]
  const content = lastMessage?.content?.toLowerCase() || ''
  
  const dateTimeKeywords = [
    'время', 'time', 'дата', 'date', 
    'который час', 'what time', 'what date',
    'сегодня', 'today', 'сейчас', 'now',
    'current time', 'current date'
  ]
  const hasDateTimeKeyword = dateTimeKeywords.some(keyword => content.includes(keyword))
  
  if (!hasDateTimeKeyword) return null
  
  const timezoneMatch = content.match(/(?:timezone|tz|в часовом поясе)\s+([a-z/]+)/i)
  const timezone = timezoneMatch ? timezoneMatch[1].trim() : null
  
  return timezone || 'default'
}

export async function enhanceMessagesWithFunctions(messages: any[]): Promise<any[]> {
  const dateTimeTimezone = detectDateTimeRequest(messages)
  
  if (dateTimeTimezone) {
    const dateTimeInfo = await getCurrentDateTime(dateTimeTimezone === 'default' ? undefined : dateTimeTimezone)
    return [
      ...messages,
      {
        role: 'system',
        content: `User asked about current date and time. Here is the information: ${dateTimeInfo}. Provide a friendly short response based on this data.`,
      },
    ]
  }
  
  return messages
}
