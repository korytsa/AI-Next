'use client'

import { forwardRef } from 'react'

const baseStyles =
  'box-border border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 shadow-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed leading-normal'

const variantStyles = {
  default:
    'border-slate-200/50 dark:border-slate-700/50 rounded-2xl',
  inline:
    'border-transparent border-b border-blue-400 bg-transparent shadow-none rounded-none text-blue-600 dark:text-blue-400 font-medium focus:border-blue-600 dark:focus:border-blue-500 focus:ring-0',
} as const

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  smWithLeftIcon: 'pl-9 pr-4 py-2 text-sm',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-3',
} as const

export type InputVariant = keyof typeof variantStyles
export type InputSize = keyof typeof sizeStyles

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  variant?: InputVariant
  size?: InputSize
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      size = 'md',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const widthClass = variant === 'inline' ? 'min-w-[60px]' : 'w-full'
    return (
      <input
        ref={ref}
        type={type}
        className={`${widthClass} ${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
