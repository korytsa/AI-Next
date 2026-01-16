/* eslint-disable */
self.onmessage = function(e) {
  const { type, messages } = e.data

  if (type === 'export') {
    try {
      const dialogText = messages
        .filter((msg) => msg.role !== 'system')
        .map((msg) => {
          const role = msg.role === 'user' ? 'You' : 'AI'
          const content = msg.error 
            ? `[Error: ${msg.error.message}]` 
            : msg.content
          return `${role}: ${content}`
        })
        .join('\n\n')

      self.postMessage({
        type: 'export',
        result: dialogText,
      })
    } catch (error) {
      self.postMessage({
        type: 'export',
        result: '',
        error: error.message || 'Failed to export messages',
      })
    }
  }
}
