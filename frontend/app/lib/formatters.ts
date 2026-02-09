const DEFAULT_LOCALE = 'en-US'

export function formatNumber(num: number, locale = DEFAULT_LOCALE): string {
  return new Intl.NumberFormat(locale).format(num)
}

export interface FormatCostOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

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

export function formatDate(timestamp: number, locale = DEFAULT_LOCALE): string {
  return new Date(timestamp).toLocaleString(locale)
}
