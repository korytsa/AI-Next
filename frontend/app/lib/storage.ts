export const getFromStorage = <T extends string>(
  key: string,
  defaultValue: T,
  validator?: (value: string) => boolean
): T => {
  if (typeof window === 'undefined') return defaultValue

  try {
    const stored = localStorage.getItem(key)
    if (!stored) return defaultValue
    return validator ? (validator(stored) ? (stored as T) : defaultValue) : (stored as T)
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const getJsonFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue

  try {
    const stored = localStorage.getItem(key)
    if (!stored) return defaultValue
    return JSON.parse(stored) as T
  } catch (error) {
    console.error(`Failed to load ${key} from localStorage:`, error)
    return defaultValue
  }
}

export const saveToStorage = (key: string, value: string) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
  }
}

export const saveJsonToStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error)
  }
}

export const removeFromStorage = (key: string) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error)
  }
}
