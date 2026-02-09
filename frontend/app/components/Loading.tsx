'use client'

import { RefreshCw } from 'lucide-react'
import { Flex } from '@/app/components/Flex'

export type LoadingVariant = 'dots' | 'spinner'
export type LoadingLayout = 'inline' | 'center' | 'fullscreen'

export interface LoadingProps {
  variant?: LoadingVariant
  layout?: LoadingLayout
  text?: string
}

const layoutStyles: Record<LoadingLayout, string> = {
  inline: 'flex justify-start',
  center: 'flex items-center justify-center py-12',
  fullscreen: 'min-h-screen flex items-center justify-center',
}

const spinnerSizes: Record<LoadingLayout, string> = {
  inline: 'w-4 h-4',
  center: 'w-6 h-6',
  fullscreen: 'w-8 h-8',
}

export function Loading({
  variant = 'spinner',
  layout = 'center',
  text,
}: LoadingProps) {
  const wrapperClass = layoutStyles[layout]
  const isFullscreen = layout === 'fullscreen'

  if (variant === 'dots') {
    return (
      <div className={wrapperClass}>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
          <Flex gap={2}>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:300ms]" />
          </Flex>
        </div>
      </div>
    )
  }

  const spinner = (
    <RefreshCw
      className={`${spinnerSizes[layout]} animate-spin text-slate-400 dark:text-slate-500`}
      aria-hidden
    />
  )

  if (isFullscreen || text) {
    return (
      <div className={wrapperClass}>
        <div className="text-center">
          <div className={isFullscreen ? 'mx-auto mb-4' : ''}>{spinner}</div>
          {text && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">{text}</p>
          )}
        </div>
      </div>
    )
  }

  return <div className={wrapperClass}>{spinner}</div>
}
