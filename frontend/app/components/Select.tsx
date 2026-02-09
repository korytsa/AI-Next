'use client'

import { forwardRef } from 'react'

// Arrow icon: stroke #9CA3AF (slate-400) — visible on both light and dark backgrounds
const arrowSvg =
  "data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M1%201L6%206L11%201%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E"

const baseStyles =
  'rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-[length:12px_8px] shadow-soft transition-all duration-200 box-border'

const sizeStyles = {
  sm: 'pl-3 pr-9 py-2 text-sm bg-[right_0.75rem_center]',
  md: 'w-full px-4 py-3 text-sm bg-[right_1rem_center]',
} as const

export type SelectSize = keyof typeof sizeStyles

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'> {
  size?: SelectSize
  className?: string
  children: React.ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${className}`.trim()}
        style={{ backgroundImage: `url('${arrowSvg}')` }}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
