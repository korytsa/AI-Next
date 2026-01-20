import Link from 'next/link'
import { ArrowLeft, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useState } from 'react'
import { UserNameBadge } from './UserNameBadge'
import { ChatSettingsPanel } from './ChatSettingsPanel'

interface ChatHeaderProps {
  useStreaming: boolean
  onToggleStreaming: () => void
  loading: boolean
  onClearHistory: () => void
  userName?: string | null
  onEditName?: (name: string) => void
  responseMode: ResponseMode
  onSetResponseMode: (mode: ResponseMode) => void
  onExportDialog?: () => void
  totalTokens?: number
  chainOfThought: ChainOfThoughtMode
  onSetChainOfThought: (mode: ChainOfThoughtMode) => void
  selectedModel: string
  onSetSelectedModel: (model: string) => void
  isExporting?: boolean
}

export function ChatHeader({ useStreaming, onToggleStreaming, loading, onClearHistory, userName, onEditName, responseMode, onSetResponseMode, onExportDialog, totalTokens, chainOfThought, onSetChainOfThought, selectedModel, onSetSelectedModel, isExporting = false }: ChatHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(true)
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b">
      <div className="pl-0.5 pr-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <UserNameBadge userName={userName} onChangeName={onEditName} />
        </div>
        <div className="flex items-center gap-4">
        {totalTokens !== undefined && totalTokens > 0 && (
            <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Tokens: <span className="font-medium">{totalTokens.toLocaleString()}</span>
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={onClearHistory}
            disabled={loading}
            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Clear chat history"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </button>
    
          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={isSettingsOpen ? "Hide settings" : "Show settings"}
          >
            {isSettingsOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
      {isSettingsOpen && (
        <ChatSettingsPanel
          useStreaming={useStreaming}
          onToggleStreaming={onToggleStreaming}
          loading={loading}
          responseMode={responseMode}
          onSetResponseMode={onSetResponseMode}
          chainOfThought={chainOfThought}
          onSetChainOfThought={onSetChainOfThought}
          selectedModel={selectedModel}
          onSetSelectedModel={onSetSelectedModel}
          onExportDialog={onExportDialog}
          isExporting={isExporting}
        />
      )}
    </div>
  )
}
