'use client'

import { useEffect, useRef } from 'react'

const overlayStyles =
  'fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300'
const panelBaseStyles =
  'fixed top-0 h-full w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-800/50 shadow-soft-xl z-[100] flex flex-col'

const sideStyles = {
  right: 'right-0 border-l',
  left: 'left-0 border-r',
} as const

export type DrawerSide = keyof typeof sideStyles

export interface DrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  side?: DrawerSide
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  panelClassName?: string
}

export function Drawer({
  open,
  onClose,
  children,
  side = 'right',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  panelClassName = '',
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, closeOnEscape])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <div
        className={overlayStyles}
        onClick={closeOnOverlayClick ? onClose : undefined}
        role="presentation"
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className={`${panelBaseStyles} ${sideStyles[side]} ${panelClassName}`.trim()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  )
}
