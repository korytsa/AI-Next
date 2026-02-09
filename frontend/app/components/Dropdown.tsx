'use client'

import { useEffect, useRef } from 'react'

const panelBaseStyles =
  'absolute top-full mt-2 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-soft-xl border border-slate-200/50 dark:border-slate-700/50 p-3 min-w-[180px]'

const alignStyles = {
  left: 'left-0',
  right: 'right-0',
} as const

export type DropdownAlign = keyof typeof alignStyles

export interface DropdownProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: DropdownAlign
  panelClassName?: string
}

export function Dropdown({
  open,
  onOpenChange,
  trigger,
  children,
  align = 'left',
  panelClassName = '',
}: DropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onOpenChange])

  return (
    <div ref={containerRef} className="relative">
      {trigger}
      {open && (
        <div
          className={`${panelBaseStyles} ${alignStyles[align]} ${panelClassName}`.trim()}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      )}
    </div>
  )
}
