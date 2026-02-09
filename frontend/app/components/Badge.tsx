'use client'

const baseStyles = 'px-2 py-1 text-xs font-medium'

const variantStyles: Record<string, string> = {
  rate_limit: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  network: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  server: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  validation_error: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  moderation_error: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  unknown: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export type BadgeVariant = keyof typeof variantStyles | (string & {})

export interface BadgeProps {
  variant?: BadgeVariant
  rounded?: 'default' | 'lg'
  className?: string
  children: React.ReactNode
}

export function Badge({
  variant = 'unknown',
  rounded = 'default',
  className = '',
  children,
}: BadgeProps) {
  const colorClass = variantStyles[variant] ?? variantStyles.unknown
  const roundedClass = rounded === 'lg' ? 'rounded-lg' : 'rounded'

  return (
    <span
      className={`${baseStyles} ${roundedClass} ${colorClass} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
