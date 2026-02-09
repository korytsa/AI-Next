'use client'

import type { LucideIcon } from 'lucide-react'
import { Card } from '@/app/components/Card'
import { Flex } from '@/app/components/Flex'

export type StatCardSize = 'md' | 'lg'

export interface StatCardProps {
  label: string
  value: React.ReactNode
  size?: StatCardSize
  subtitle?: React.ReactNode
  icon?: LucideIcon
  iconClassName?: string
  valueClassName?: string
  rounded?: 'xl' | '2xl'
  className?: string
}

const sizeStyles: Record<StatCardSize, string> = {
  md: 'text-xl font-semibold',
  lg: 'text-2xl font-bold',
}

const labelStyles = 'text-xs text-slate-600 dark:text-slate-400 mb-1'

export function StatCard({
  label,
  value,
  size = 'md',
  subtitle,
  icon: Icon,
  iconClassName = 'text-slate-500',
  valueClassName = 'text-slate-700 dark:text-slate-300',
  rounded = 'xl',
  className = '',
}: StatCardProps) {
  const valueSizeClass = sizeStyles[size]

  return (
    <Card rounded={rounded} className={`p-3 ${className}`.trim()}>
      {Icon != null ? (
        <Flex align="center" justify="between" className="mb-2">
          <span className={labelStyles}>{label}</span>
          <Icon className={`w-4 h-4 shrink-0 ${iconClassName}`} />
        </Flex>
      ) : (
        <div className={labelStyles}>{label}</div>
      )}
      <div className={`${valueSizeClass} ${valueClassName}`.trim()}>{value}</div>
      {subtitle != null && (
        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</div>
      )}
    </Card>
  )
}
