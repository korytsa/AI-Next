import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { SuspenseFallback } from '@/app/components/SuspenseFallback'

export const revalidate = 60

const loadChatView = () =>
  import('./ChatView').catch((err) => {
    if (err?.name === 'ChunkLoadError') return import('./ChatView')
    throw err
  })

const ChatView = dynamic(loadChatView, {
  loading: () => <SuspenseFallback />,
})

export default function ChatPage() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <ChatView />
    </Suspense>
  )
}
