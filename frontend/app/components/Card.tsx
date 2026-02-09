'use client'

const baseStyles =
  'bg-slate-50/80 dark:bg-slate-800/50 p-4 transition-all duration-200'

const variantStyles = {
  default: '',
  bordered:
    'border border-slate-200/50 dark:border-slate-700/50',
  hoverable:
    'hover:bg-slate-100/80 dark:hover:bg-slate-700/50 shadow-soft hover:shadow-soft-lg',
} as const

const roundedStyles = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
} as const

export type CardVariant = keyof typeof variantStyles
export type CardRounded = keyof typeof roundedStyles

export interface CardProps {
  variant?: CardVariant
  rounded?: CardRounded
  className?: string
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  rounded = '2xl',
  className = '',
  children,
}: CardProps) {
  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${roundedStyles[rounded]} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
