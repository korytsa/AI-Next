'use client'

import { cn } from '@/app/lib/utils'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children?: React.ReactNode
}

export function Box({ className = '', children, ...rest }: BoxProps) {
  return (
    <div className={cn(className)} {...rest}>
      {children}
    </div>
  )
}
