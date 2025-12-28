"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/dashboard')
      }
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-2">
        <div className="text-xl font-semibold">Giriş doğrulanıyor…</div>
        <div className="text-sm text-gray-400">Lütfen bekleyin, yönlendiriliyorsunuz.</div>
      </div>
    </div>
  )
}
