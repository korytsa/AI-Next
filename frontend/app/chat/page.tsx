'use client'

import { useChat } from './hooks/useChat'
import { ChatHeader } from './components/ChatHeader'
import { MessagesList } from './components/MessagesList'
import { ChatInput } from './components/ChatInput'

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
    handleSetUserName,
    responseMode,
    handleSetResponseMode,
    exportDialog,
    totalTokens,
    chainOfThought,
    handleSetChainOfThought,
    selectedModel,
    handleSetSelectedModel,
    autoPlayVoice,
    handleSetAutoPlayVoice,
    loadMoreMessages,
    hasMoreMessages,
    isLoadingMore,
    messagesStartRef,
    isExporting,
    cancelRequest,
    searchQuery,
    setSearchQuery,
  } = useChat()

  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader
        useStreaming={useStreaming}
        onToggleStreaming={() => setUseStreaming(!useStreaming)}
        loading={loading}
        onClearHistory={clearHistory}
        userName={userName}
        onEditName={handleSetUserName}
        responseMode={responseMode}
        onSetResponseMode={handleSetResponseMode}
        onExportDialog={exportDialog}
        totalTokens={totalTokens}
        chainOfThought={chainOfThought}
        onSetChainOfThought={handleSetChainOfThought}
        selectedModel={selectedModel}
        onSetSelectedModel={handleSetSelectedModel}
        autoPlayVoice={autoPlayVoice}
        onToggleAutoPlayVoice={() => handleSetAutoPlayVoice(!autoPlayVoice)}
        isExporting={isExporting}
        currentInput={input}
        onSelectTemplate={(content) => setInput(content)}
        searchQuery={searchQuery}
        onSetSearchQuery={setSearchQuery}
      />
      <MessagesList 
        messages={messages} 
        messagesEndRef={messagesEndRef}
        messagesStartRef={messagesStartRef}
        loading={loading}
        onRetry={retryLastMessage}
        onLoadMore={loadMoreMessages}
        hasMoreMessages={hasMoreMessages}
        isLoadingMore={isLoadingMore}
        searchQuery={searchQuery}
        autoPlayVoice={autoPlayVoice}
        useStreaming={useStreaming}
      />
      <ChatInput ref={inputRef} input={input} setInput={setInput} onSubmit={handleSubmit} loading={loading} onCancel={cancelRequest} />
    </div>
  )
}
