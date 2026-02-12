'use client'

import { useChat } from './hooks/useChat'
import { ChatHeader } from './components/ChatHeader'
import { MessagesList } from './components/MessagesList'
import { ChatInput } from './components/ChatInput'

export default function ChatView() {
  const {
    messages,
    input,
    setInput,
    loading,
    useStreaming,
    handleSetUseStreamingWithCache,
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
    useRAG,
    handleSetUseRAG,
    useCache,
    handleSetUseCache,
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <ChatHeader
        useStreaming={useStreaming}
        onToggleStreaming={() => handleSetUseStreamingWithCache(!useStreaming)}
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
        useRAG={useRAG}
        onToggleUseRAG={() => handleSetUseRAG(!useRAG)}
        useCache={useCache}
        onToggleUseCache={() => handleSetUseCache(!useCache)}
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
