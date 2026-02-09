const DEFAULT_LOCALE = 'en-US'

/**
 * Formats a number with locale-aware grouping (e.g. 1,234,567).
 */
export function formatNumber(num: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(num)
}

export interface FormatCostOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

/**
 * Formats a number as currency (default: USD, 6 fraction digits for small amounts).
 */
export function formatCost(
  cost: number,
  options: FormatCostOptions = {}
): string {
  const {
    locale = DEFAULT_LOCALE,
    currency = 'USD',
    minimumFractionDigits = 6,
    maximumFractionDigits = 6,
  } = options
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(cost)
}

/**
 * Formats a Unix timestamp (ms) as a locale date-time string.
 */
export function formatDate(timestamp: number, locale = DEFAULT_LOCALE): string {
  return new Date(timestamp).toLocaleString(locale)
}
