'use client'

import { useChat } from './hooks/useChat'
import { ChatHeader } from './components/ChatHeader'
import { MessagesList } from './components/MessagesList'
import { ChatInput } from './components/ChatInput'
import { NameModal } from './components/NameModal'

export default function ChatPage() {
  const {
    messages,
    input,
    setInput,
    loading,
    useStreaming,
    setUseStreaming,
    messagesEndRef,
    inputRef,
    handleSubmit,
    clearHistory,
    retryLastMessage,
    userName,
    showNameModal,
    handleSetUserName,
    setShowNameModal,
    responseMode,
    handleSetResponseMode,
    exportDialog,
    totalTokens,
    chainOfThought,
    handleSetChainOfThought,
  } = useChat()

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader
        useStreaming={useStreaming}
        onToggleStreaming={() => setUseStreaming(!useStreaming)}
        loading={loading}
        onClearHistory={clearHistory}
        userName={userName}
        onEditName={() => setShowNameModal(true)}
        responseMode={responseMode}
        onSetResponseMode={handleSetResponseMode}
        onExportDialog={exportDialog}
        totalTokens={totalTokens}
        chainOfThought={chainOfThought}
        onSetChainOfThought={handleSetChainOfThought}
      />
      <MessagesList 
        messages={messages} 
        messagesEndRef={messagesEndRef} 
        loading={loading}
        onRetry={retryLastMessage}
      />
      <ChatInput ref={inputRef} input={input} setInput={setInput} onSubmit={handleSubmit} loading={loading} />
      <NameModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={handleSetUserName}
      />
    </div>
  )
}
