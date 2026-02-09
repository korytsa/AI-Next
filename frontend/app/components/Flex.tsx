'use client'

import { cn } from '@/app/lib/utils'

const directionStyles = {
  row: 'flex',
  col: 'flex flex-col',
} as const

const alignStyles = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const

const justifyStyles = {
  start: 'justify-start',
  end: 'justify-end',
  between: 'justify-between',
  center: 'justify-center',
} as const

const gapStyles = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  6: 'gap-6',
  '0.2': 'gap-[0.2px]',
} as const

export type FlexDirection = keyof typeof directionStyles
export type FlexAlign = keyof typeof alignStyles
export type FlexJustify = keyof typeof justifyStyles
export type FlexGap = keyof typeof gapStyles

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: FlexDirection
  align?: FlexAlign
  justify?: FlexJustify
  gap?: FlexGap
  wrap?: boolean
  className?: string
  children?: React.ReactNode
}

export function Flex({
  direction = 'row',
  align,
  justify,
  gap,
  wrap = false,
  className = '',
  children,
  ...rest
}: FlexProps) {
  return (
    <div
      className={cn(
        directionStyles[direction],
        align != null && alignStyles[align],
        justify != null && justifyStyles[justify],
        gap != null && gapStyles[gap],
        wrap && 'flex-wrap',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
