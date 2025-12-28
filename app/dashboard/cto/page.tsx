"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Wrench, Cpu } from "lucide-react"

export default function CtoPage() {
  const [result, setResult] = useState<string>("")
  const [task, setTask] = useState<string>("Genel sistem sağlık taraması")

  const runTask = async () => {
    const res = await fetch("/api/ai/cto", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ task }),
    })
    const data = await res.json()
    setResult(data.output)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">AI CTO Motoru</h2>
        <p className="text-muted-foreground">Mimari, güvenlik ve performans konularında 7/24 öneriler üretir.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Health Check</CardTitle>
            <CardDescription>Sistem sağlık analizi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm"><Shield className="w-4 h-4" /> Güvenlik politikaları</div>
            <div className="flex items-center gap-2 text-sm"><Cpu className="w-4 h-4" /> Performans profili</div>
            <div className="flex items-center gap-2 text-sm"><Wrench className="w-4 h-4" /> Bakım planı</div>
            <div className="space-y-2">
              <Label>Görev</Label>
              <Input value={task} onChange={(e) => setTask(e.target.value)} />
            </div>
            <Button variant="premium" onClick={runTask}>Çalıştır</Button>
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
