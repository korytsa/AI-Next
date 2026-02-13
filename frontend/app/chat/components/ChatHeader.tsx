import Link from 'next/link'
import { Trash2, Search, Settings } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useState, useEffect } from 'react'
import { UserNameBadge } from './UserNameBadge'
import { ChatSettingsDrawer } from './ChatSettingsDrawer'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageSwitcher } from '@/app/components/LanguageSwitcher'
import { Button } from '@/app/components/Button'
import { Input } from '@/app/components/Input'
import { Heading } from '@/app/components/Heading'
import { Flex } from '@/app/components/Flex'
import { formatNumber } from '@/app/lib/formatters'

interface ChatHeaderProps {
  useStreaming: boolean
  onToggleStreaming: () => void
  loading: boolean
  onClearHistory: () => void
  userName?: string | null
  onEditName?: (name: string) => void
  responseMode: ResponseMode
  onSetResponseMode: (mode: ResponseMode) => void
  onExportDialog?: (format: 'txt' | 'markdown' | 'json' | 'pdf') => void
  totalTokens?: number
  chainOfThought: ChainOfThoughtMode
  onSetChainOfThought: (mode: ChainOfThoughtMode) => void
  selectedModel: string
  onSetSelectedModel: (model: string) => void
  autoPlayVoice?: boolean
  onToggleAutoPlayVoice?: () => void
  useRAG?: boolean
  onToggleUseRAG?: () => void
  useCache?: boolean
  onToggleUseCache?: () => void
  isExporting?: boolean
  currentInput?: string
  onSelectTemplate?: (content: string) => void
  searchQuery?: string
  onSetSearchQuery?: (query: string) => void
}

export function ChatHeader({ useStreaming, onToggleStreaming, loading, onClearHistory, userName, onEditName, responseMode, onSetResponseMode, onExportDialog, totalTokens, chainOfThought, onSetChainOfThought, selectedModel, onSetSelectedModel, autoPlayVoice, onToggleAutoPlayVoice, useRAG, onToggleUseRAG, useCache, onToggleUseCache, isExporting = false, currentInput = '', onSelectTemplate, searchQuery = '', onSetSearchQuery }: ChatHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [userNickname, setUserNickname] = useState<string>('')
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.loggedIn)
        setUserNickname(data.nickname ?? '')
      })
      .catch(() => setIsLoggedIn(false))
  }, [])

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    setIsLoggedIn(false)
    setUserNickname('')
  }

  const displayName =
    isLoggedIn && userNickname ? userNickname : (userName ?? 'user')

  const handleEditName = async (name: string) => {
    if (isLoggedIn) {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: name }),
        credentials: 'include',
      })
      if (res.ok) {
        setUserNickname(name)
      }
    } else if (onEditName) {
      onEditName(name)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-soft">
        <Flex align="center" justify="between" className="pl-0.5 pr-16 py-5">
        <Flex align="center" gap={4}>
          <div className="pl-4" />
          <Heading as="h1" size="2xl" weight="bold" color="inherit">{t('chat.title')}</Heading>
          <UserNameBadge
            userName={displayName}
            onChangeName={handleEditName}
          />
        </Flex>
        <Flex align="center" gap={4}>
        {totalTokens !== undefined && totalTokens > 0 && (
            <div className="px-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl shadow-soft backdrop-blur-sm">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {t('metrics.tokens')}: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{formatNumber(totalTokens)}</span>
              </span>
            </div>
          )}
          {onSetSearchQuery && (
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSetSearchQuery(e.target.value)}
                placeholder={t('settings.searchPlaceholder')}
                size="smWithLeftIcon"
              />
            </div>
          )}
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={onClearHistory}
            disabled={loading}
            className="shadow-soft hover:shadow-soft-lg"
            title={t('chat.clearHistory')}
          >
            <Trash2 className="w-4 h-4" />
            {t('chat.clearHistory')}
          </Button>
          <Link href="/pricing">
            <Button variant="successGhost" size="md">
              {t('common.upgrade')}
            </Button>
          </Link>
          {isLoggedIn !== null &&
            (isLoggedIn ? (
              <Button variant="ghost" size="md" onClick={handleSignOut}>
                {t('auth.signOut')}
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="md">
                  {t('auth.signIn')}
                </Button>
              </Link>
            ))}
          <LanguageSwitcher />
          <Button
            type="button"
            variant="icon"
            size="iconMd"
            onClick={() => setIsSettingsOpen(true)}
            title={t('settings.title')}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </Flex>
        </Flex>
      </div>
      <ChatSettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        useStreaming={useStreaming}
        onToggleStreaming={onToggleStreaming}
        loading={loading}
        responseMode={responseMode}
        onSetResponseMode={onSetResponseMode}
        chainOfThought={chainOfThought}
        onSetChainOfThought={onSetChainOfThought}
        selectedModel={selectedModel}
        onSetSelectedModel={onSetSelectedModel}
        autoPlayVoice={autoPlayVoice}
        onToggleAutoPlayVoice={onToggleAutoPlayVoice}
        useRAG={useRAG}
        onToggleUseRAG={onToggleUseRAG}
        useCache={useCache}
        onToggleUseCache={onToggleUseCache}
        onExportDialog={onExportDialog}
        isExporting={isExporting}
        currentInput={currentInput}
        onSelectTemplate={onSelectTemplate}
      />
    </>
  )
}
