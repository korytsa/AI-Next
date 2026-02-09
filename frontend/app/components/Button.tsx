'use client'

import { forwardRef } from 'react'

const variantStyles = {
  primary:
    'bg-gradient-to-br from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-soft-lg hover:shadow-soft-xl',
  secondary:
    'bg-slate-200/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-300/80 dark:hover:bg-slate-600/80',
  ghost:
    'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
  danger:
    'text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30',
  dangerFilled:
    'bg-red-600 text-white hover:bg-red-700',
  dangerGradient:
    'bg-gradient-to-br from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 shadow-soft-lg hover:shadow-soft-xl',
  success:
    'bg-gradient-to-br from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-soft-lg hover:shadow-soft-xl',
  successGhost:
    'text-green-600 dark:text-green-400 hover:bg-green-50/80 dark:hover:bg-green-900/30 bg-transparent shadow-soft hover:shadow-soft-lg',
  blue:
    'bg-blue-600 text-white hover:bg-blue-700',
  icon:
    'p-2.5 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 rounded-2xl shadow-soft hover:shadow-soft-lg text-slate-600 dark:text-slate-400',
  iconClose:
    'p-2 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 rounded-xl',
  toggle:
    'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
  toggleActive:
    'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-soft-lg font-medium',
  language:
    'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
  dangerSoft:
    'bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 hover:bg-red-200/80 dark:hover:bg-red-900/60 shadow-soft hover:shadow-soft-lg',
  primaryGhost:
    'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 shadow-soft hover:shadow-soft-lg',
  tab:
    'border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50',
  tabActive:
    'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20',
  ghostLeft:
    'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 text-left',
  dangerIcon:
    'p-2 text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity',
} as const

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-2xl',
  lg: 'px-6 py-3 rounded-3xl',
  iconSm: 'p-2 rounded-xl',
  iconMd: 'p-2.5 rounded-2xl',
  iconTiny: 'p-0.5 rounded',
  tab: 'flex-1 px-4 py-3',
  none: '',
} as const

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: ButtonVariant
  size?: ButtonSize
  active?: boolean
  className?: string
  children: React.ReactNode
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2'

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      active = false,
      className = '',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const variantClass =
      variant === 'toggle' && active
        ? variantStyles.toggleActive
        : variant === 'tab' && active
          ? variantStyles.tabActive
          : variantStyles[variant]
    const sizeClass = sizeStyles[size]

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
