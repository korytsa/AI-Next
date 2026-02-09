'use client'

import { forwardRef } from 'react'

const baseStyles =
  'w-full px-5 py-3 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 shadow-soft transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto box-border leading-normal'

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {
  className?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${className}`.trim()}
        {...props}
      />
    )
  }
)

TextArea.displayName = 'TextArea'
