"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Globe, KeyRound, ListChecks } from "lucide-react"

export default function SeoPage() {
  const [keyword, setKeyword] = useState<string>("global martech platform")
  const [result, setResult] = useState<string>("")

  const generate = async (task: string) => {
    const res = await fetch("/api/ai/seo", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ task, keyword }),
    })
    const data = await res.json()
    setResult(data.output)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">AI SEO Motoru</h2>
        <p className="text-muted-foreground">Anahtar kelime stratejisi, teknik SEO ve içerik planı üretir.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Anahtar Kelime</CardTitle>
            <CardDescription>Hedef alan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Kelime</Label>
              <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" onClick={() => generate("Keyword Strategy")}>Keyword Strategy</Button>
              <Button variant="outline" onClick={() => generate("Technical SEO Check")}>Technical SEO Check</Button>
              <Button variant="premium" onClick={() => generate("Content Plan")}>Content Plan</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2 glass-card">
          <CardHeader>
            <CardTitle>Sonuç</CardTitle>
            <CardDescription>Motor çıktısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] rounded-lg border border-white/10 bg-white/5 p-4 text-sm whitespace-pre-wrap">{result || "Henüz bir görev çalıştırılmadı."}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
