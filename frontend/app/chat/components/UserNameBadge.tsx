import { useState, useEffect, KeyboardEvent } from 'react'
import { User, Edit2, Check, X } from 'lucide-react'

interface UserNameBadgeProps {
  userName?: string | null
  onChangeName?: (name: string) => void
}

export function UserNameBadge({ userName, onChangeName }: UserNameBadgeProps) {
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
    if (onChangeName && editedName.trim()) {
      onChangeName(editedName.trim())
    }
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditedName(userName || 'user')
    setIsEditingName(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveName()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
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
          {onChangeName && (
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
  )
}

