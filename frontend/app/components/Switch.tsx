'use client'

const trackSizes = {
  sm: 'h-6 w-11',
  md: 'h-7 w-12',
} as const

const checkedTrackStyles = {
  primary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
  purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
  success: 'bg-gradient-to-r from-green-500 to-emerald-500',
  blue: 'bg-blue-500',
} as const

const thumbTranslateChecked = {
  sm: 'translate-x-6',
  md: 'translate-x-6',
} as const

const offTrackStyles = 'bg-slate-300 dark:bg-slate-700'
const offTrackStylesGray = 'bg-gray-300'

export type SwitchSize = keyof typeof trackSizes
export type SwitchVariant = keyof typeof checkedTrackStyles

export interface SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  size?: SwitchSize
  variant?: SwitchVariant
  /** Use gray (instead of slate) for off state — matches ChatSettingsPanel compact toggles */
  offVariant?: 'slate' | 'gray'
  className?: string
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  size = 'md',
  variant = 'primary',
  offVariant = 'slate',
  className = '',
}: SwitchProps) {
  const trackBg = checked
    ? checkedTrackStyles[variant]
    : offVariant === 'gray'
      ? offTrackStylesGray
      : offTrackStyles

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex items-center rounded-full transition-all duration-200 shadow-soft disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:ring-offset-2 ${trackSizes[size]} ${trackBg} ${className}`.trim()}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${checked ? thumbTranslateChecked[size] : 'translate-x-1'}`}
      />
    </button>
  )
}
