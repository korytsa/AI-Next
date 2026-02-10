import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Loading } from '@/app/components/Loading'

export const revalidate = 60

const ChatView = dynamic(() => import('./ChatView'), {
  loading: () => <Loading variant="spinner" layout="fullscreen" />,
})

export default function ChatPage() {
  return (
    <Suspense fallback={<Loading variant="spinner" layout="fullscreen" />}>
      <ChatView />
    </Suspense>
  )
}
