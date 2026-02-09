'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/app/components/Button'
import { Heading } from '@/app/components/Heading'

const overlayStyles =
  'fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4'
const panelStyles =
  'bg-white dark:bg-slate-800 rounded-2xl shadow-soft-xl border border-slate-200/50 dark:border-slate-700/50 p-6 min-w-[400px] max-w-md'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  contentClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  closeOnOverlayClick = false,
  closeOnEscape = true,
  contentClassName = '',
}: ModalProps) {
  useEffect(() => {
    if (!open || !closeOnEscape) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, closeOnEscape])

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

  if (!open) return null

  return (
    <div
      className={overlayStyles}
      onClick={closeOnOverlayClick ? onClose : undefined}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`${panelStyles} ${contentClassName}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <div className="flex items-center justify-between mb-4">
            <Heading as="h2" size="lg" weight="semibold" id="modal-title">
              {title}
            </Heading>
            <Button
              variant="iconClose"
              size="iconSm"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
