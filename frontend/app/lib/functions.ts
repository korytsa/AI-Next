export interface FunctionCall {
  name: string
  arguments: string
}

export interface FunctionResult {
  name: string
  result: any
}

export async function getCurrentDateTime(timezone?: string): Promise<string> {
  const now = new Date()
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timezone || 'UTC',
  }
  
  const dateTimeString = now.toLocaleString('en-US', options)
  const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' })
  const timezoneName = Intl.DateTimeFormat('en-US', { timeZoneName: 'long', timeZone: timezone || 'UTC' }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || 'UTC'
  
  return `Current date and time: ${dayOfWeek}, ${dateTimeString} (${timezoneName})`
}

export const AVAILABLE_FUNCTIONS: Record<string, (args: any) => Promise<any>> = {
  getCurrentDateTime,
}

export const FUNCTION_DEFINITIONS: any[] = []
