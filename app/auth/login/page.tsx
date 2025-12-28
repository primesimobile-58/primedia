"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [providers, setProviders] = useState<{googleEnabled: boolean; appleEnabled: boolean}>({ googleEnabled: false, appleEnabled: false })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/providers')
        const json = await res.json()
        setProviders({ googleEnabled: Boolean(json.googleEnabled), appleEnabled: Boolean(json.appleEnabled) })
      } catch {}
    }
    load()
  }, [])

  const login = async () => {
    setLoading(true)
    setMessage("")
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anon) {
      setMessage("Supabase yapılandırılmadı. Lütfen env değişkenlerini ekleyin.")
      setLoading(false)
      return
    }
    const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: anon,
      },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    setLoading(false)
    if (data?.access_token) {
      localStorage.setItem('alya_access_token', data.access_token)
      setMessage("Giriş başarılı. Yönlendiriliyor...")
      router.push('/dashboard')
    } else {
      setMessage("Giriş başarısız. Bilgilerinizi kontrol edin.")
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    setMessage("")
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
    if (error) {
      setMessage('Google ile giriş başlatılamadı.')
      setLoading(false)
    }
  }

  const signInWithApple = async () => {
    setLoading(true)
    setMessage("")
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } })
    if (error) {
      setMessage('Apple ile giriş başlatılamadı.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials to access dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Button variant="premium" onClick={login} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button variant="outline" onClick={signInWithGoogle} disabled={loading || !providers.googleEnabled}>Google ile Giriş</Button>
            <Button variant="outline" onClick={signInWithApple} disabled={loading || !providers.appleEnabled}>Apple ile Giriş</Button>
          </div>
          {message && <div className="text-sm text-muted-foreground">{message}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
