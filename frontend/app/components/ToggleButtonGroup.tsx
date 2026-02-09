'use client'

import { Button } from '@/app/components/Button'
import { Flex } from '@/app/components/Flex'
import type { ButtonSize } from '@/app/components/Button'

export interface ToggleButtonGroupOption<T extends string = string> {
  value: T
  label: string
}

export type ToggleButtonGroupLayout = 'stacked' | 'inline'

export interface ToggleButtonGroupProps<T extends string = string> {
  value: T
  onChange: (value: T) => void
  options: ToggleButtonGroupOption<T>[]
  disabled?: boolean
  size?: ButtonSize
  label?: string
  /** 'stacked' = label above buttons; 'inline' = label and buttons in one row (e.g. settings panel). */
  layout?: ToggleButtonGroupLayout
  /** Applied to each button. Use function for per-index class (e.g. first rounded-2xl, rest rounded-lg). */
  buttonClassName?: string | ((index: number) => string)
}

export function ToggleButtonGroup<T extends string = string>({
  value,
  onChange,
  options,
  disabled = false,
  size = 'md',
  label,
  layout = 'stacked',
  buttonClassName = '',
}: ToggleButtonGroupProps<T>) {
  const getClassName = (index: number) =>
    typeof buttonClassName === 'function' ? buttonClassName(index) : buttonClassName

  const buttons = (
    <Flex gap={2}>
      {options.map((opt, index) => (
        <Button
          key={opt.value}
          type="button"
          variant="toggle"
          size={size}
          active={value === opt.value}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={getClassName(index)}
        >
          {opt.label}
        </Button>
      ))}
    </Flex>
  )

  if (layout === 'inline') {
    return (
      <Flex align="center" gap="0.2">
        {label != null && (
          <span className="text-xs text-gray-500 dark:text-gray-500">{label}</span>
        )}
        {buttons}
      </Flex>
    )
  }

  return (
    <Flex direction="col">
      {label != null && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {label}
        </label>
      )}
      {buttons}
    </Flex>
  )
}
