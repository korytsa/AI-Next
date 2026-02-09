'use client'

const sizeStyles = {
  '3xl': 'text-3xl',
  '2xl': 'text-2xl',
  xl: 'text-xl',
  lg: 'text-lg',
  sm: 'text-sm',
} as const

const weightStyles = {
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
} as const

const colorStyles = {
  default: 'text-slate-700 dark:text-slate-300',
  inherit: '',
} as const

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4'
export type HeadingSize = keyof typeof sizeStyles
export type HeadingWeight = keyof typeof weightStyles
export type HeadingColor = keyof typeof colorStyles

export interface HeadingProps {
  as?: HeadingLevel
  size?: HeadingSize
  weight?: HeadingWeight
  color?: HeadingColor
  id?: string
  className?: string
  children: React.ReactNode
}

export function Heading({
  as: Tag = 'h2',
  size = 'lg',
  weight = 'semibold',
  color = 'default',
  id,
  className = '',
  children,
}: HeadingProps) {
  return (
    <Tag
      id={id}
      className={`${sizeStyles[size]} ${weightStyles[weight]} ${colorStyles[color]} ${className}`.trim()}
    >
      {children}
    </Tag>
  )
}
