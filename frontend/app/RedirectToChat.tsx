'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function RedirectToChat() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/chat')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/10">
      <p className="text-slate-500 dark:text-slate-400 text-sm">Redirecting…</p>
    </div>
  )
}
