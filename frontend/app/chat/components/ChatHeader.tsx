import Link from 'next/link'
import { ArrowLeft, Trash2, User, Edit2, Download, Check, X } from 'lucide-react'
import { ResponseMode, ChainOfThoughtMode } from '../hooks/useChat'
import { useState, useEffect } from 'react'

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
  isExporting?: boolean
}

export function ChatHeader({ useStreaming, onToggleStreaming, loading, onClearHistory, userName, onEditName, responseMode, onSetResponseMode, onExportDialog, totalTokens, chainOfThought, onSetChainOfThought, isExporting = false }: ChatHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState(userName || 'user')

  useEffect(() => {
    if (!isEditingName) {
      setEditedName(userName || 'user')
    }
  }, [userName, isEditingName])

  const handleStartEdit = () => {
    setEditedName(userName || 'user')
    setIsEditingName(true)
  }

  const handleSaveName = () => {
    if (onEditName && editedName.trim()) {
      onEditName(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditedName(userName || 'user')
    setIsEditingName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveName}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border-b border-blue-400 focus:outline-none focus:border-blue-600 px-1 min-w-[60px]"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded"
                title="Save"
              >
                <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-0.5 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded"
                title="Cancel"
              >
                <X className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          ) : (
            <>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{userName || 'user'}</span>
              {onEditName && (
                <button
                  onClick={handleStartEdit}
                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg"
                  title="Change name"
                >
                  <Edit2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetResponseMode('short')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              responseMode === 'short'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Short
          </button>
          <button
            type="button"
            onClick={() => onSetResponseMode('detailed')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              responseMode === 'detailed'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Detailed
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-500">CoT:</span>
          <button
            type="button"
            onClick={() => onSetChainOfThought('none')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'none'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => onSetChainOfThought('short')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'short'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Short
          </button>
          <button
            type="button"
            onClick={() => onSetChainOfThought('detailed')}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              chainOfThought === 'detailed'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Detailed
          </button>
        </div>
        {onExportDialog && (
          <button
            type="button"
            onClick={onExportDialog}
            disabled={loading || isExporting}
            className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title={isExporting ? "Exporting..." : "Save as text"}
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
            {isExporting ? 'Exporting...' : 'Save as text'}
          </button>
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
        {totalTokens !== undefined && totalTokens > 0 && (
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Tokens: <span className="font-medium">{totalTokens.toLocaleString()}</span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Streaming</span>
          <button
            type="button"
            onClick={onToggleStreaming}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useStreaming ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            disabled={loading}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useStreaming ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
