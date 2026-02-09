'use client'

import { LucideIcon } from 'lucide-react'
import { Button } from '@/app/components/Button'

export type SettingsTabId = 'ai' | 'voice' | 'export' | 'templates' | 'metrics' | 'errors'

export interface SettingsTabItem {
  id: SettingsTabId
  label: string
  icon: LucideIcon
}

interface SettingsTabBarProps {
  tabs: SettingsTabItem[]
  activeTab: SettingsTabId
  onTabChange: (id: SettingsTabId) => void
}

export function SettingsTabBar({ tabs, activeTab, onTabChange }: SettingsTabBarProps) {
  return (
    <div className="flex border-b border-slate-200/50 dark:border-slate-800/50 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Button
            key={tab.id}
            variant="tab"
            size="tab"
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className="text-sm font-medium whitespace-nowrap"
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
