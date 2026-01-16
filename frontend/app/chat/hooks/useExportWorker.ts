import { useRef, useCallback, useEffect } from 'react'
import { Message } from '../types'

export function useExportWorker() {
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [])

  const exportMessages = useCallback((messages: Message[]): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        workerRef.current = new Worker('/workers/export-worker.js')
      }

      const worker = workerRef.current

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'export') {
          if (e.data.error) {
            reject(new Error(e.data.error))
          } else {
            resolve(e.data.result)
          }
          worker.removeEventListener('message', handleMessage)
          worker.removeEventListener('error', handleError)
        }
      }

      const handleError = (error: ErrorEvent) => {
        reject(new Error(error.message || 'Worker error'))
        worker.removeEventListener('message', handleMessage)
        worker.removeEventListener('error', handleError)
      }

      worker.addEventListener('message', handleMessage)
      worker.addEventListener('error', handleError)

      worker.postMessage({
        type: 'export',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          error: msg.error,
        })),
      })
    })
  }, [])

  return {
    exportMessages,
  }
}
