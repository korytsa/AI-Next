'use client'

import type { LucideIcon } from 'lucide-react'
import { Card } from '@/app/components/Card'
import { Switch } from '@/app/components/Switch'
import { Flex } from '@/app/components/Flex'
import type { SwitchSize, SwitchVariant } from '@/app/components/Switch'

export interface SettingsSwitchCardProps {
  icon: LucideIcon
  iconClassName?: string
  title: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  switchSize?: SwitchSize
  switchVariant?: SwitchVariant
  switchOffVariant?: 'slate' | 'gray'
}

export function SettingsSwitchCard({
  icon: Icon,
  iconClassName = 'text-indigo-500',
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  switchSize = 'md',
  switchVariant = 'primary',
  switchOffVariant = 'slate',
}: SettingsSwitchCardProps) {
  return (
    <Card>
      <Flex align="center" justify="between">
      <Flex align="center" gap={3}>
        <Icon className={`w-5 h-5 shrink-0 ${iconClassName}`} />
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
          {description != null && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      </Flex>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        size={switchSize}
        variant={switchVariant}
        offVariant={switchOffVariant}
      />
      </Flex>
    </Card>
  )
}
