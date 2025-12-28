"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Globe2, Cpu, Video } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function EnginesPage() {
  const [feed, setFeed] = useState<any>(null)
  const [shortsFeed, setShortsFeed] = useState<any>(null)
  const [state, setState] = useState<any>({ contentFeed: "idle", siteControl: "idle" })
  const [shortsState, setShortsState] = useState<any>({ shorts: "idle" })
  const [enqueueTopic, setEnqueueTopic] = useState<string>("")
  const [enqueueLocale, setEnqueueLocale] = useState<string>("US")
  const [inspireUrl, setInspireUrl] = useState<string>("")

  const refreshFeed = async () => {
    const res = await fetch("/api/engines/feed")
    const data = await res.json()
    setFeed(data)
  }

  const refreshShortsFeed = async () => {
    const res = await fetch("/api/shorts/feed")
    const data = await res.json()
    setShortsFeed(data)
  }

  const setEngine = async (engine: string, action: "start" | "stop") => {
    const res = await fetch("/api/engines/control", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ engine, action }),
    })
    const data = await res.json()
    setState(data.state)
  }

  const setShortsEngine = async (action: "start" | "stop") => {
    const res = await fetch("/api/shorts/control", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    })
    const data = await res.json()
    setShortsState(data.state)
  }

  useEffect(() => {
    refreshFeed()
    refreshShortsFeed()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Ecosystem Engines</h2>
        <p className="text-muted-foreground">24/7 güncel çalışan iki motorun durumunu yönet.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Content Feed Engine</CardTitle>
            <CardDescription>Küresel içerik ve trend beslemeleri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>Durum: {state.contentFeed}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEngine("contentFeed", "start")}>Start</Button>
              <Button variant="outline" onClick={() => setEngine("contentFeed", "stop")}>Stop</Button>
              <Button variant="premium" onClick={refreshFeed}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
            <div className="rounded-lg border border-white/10 p-4 bg-white/5">
              <div className="text-xs text-muted-foreground">Last Update</div>
              <div className="text-sm">{feed ? new Date(feed.timestamp).toLocaleString() : "-"}</div>
              <div className="mt-3 text-xs text-muted-foreground">Sources</div>
              <ul className="text-sm">
                {feed?.sources?.map((s: any) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.items}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Site Control Engine</CardTitle>
            <CardDescription>Küresel erişim ve operasyon orkestrasyonu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Globe2 className="w-4 h-4 text-indigo-400" />
              <span>Durum: {state.siteControl}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEngine("siteControl", "start")}>Start</Button>
              <Button variant="outline" onClick={() => setEngine("siteControl", "stop")}>Stop</Button>
            </div>
            <div className="rounded-lg border border-white/10 p-4 bg-white/5 text-sm">
              <div>CDN health: ok</div>
              <div>Edge regions: 12</div>
              <div>Latency: 87ms</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Shorts Engine</CardTitle>
            <CardDescription>Otomatik Shorts üretimi ve yayın kontrolü.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Video className="w-4 h-4 text-pink-400" />
              <span>Durum: {shortsState.shorts}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShortsEngine("start")}>Start</Button>
              <Button variant="outline" onClick={() => setShortsEngine("stop")}>Stop</Button>
              <Button variant="premium" onClick={refreshShortsFeed}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
            <div className="rounded-lg border border-white/10 p-4 bg-white/5">
              <div className="text-xs text-muted-foreground">Last Update</div>
              <div className="text-sm">{shortsFeed ? new Date(shortsFeed.timestamp).toLocaleString() : "-"}</div>
              <div className="mt-3 text-xs text-muted-foreground">Sources</div>
              <ul className="text-sm">
                {shortsFeed?.sources?.map((s: any) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">{s.items}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Topic" value={enqueueTopic} onChange={(e) => setEnqueueTopic(e.target.value)} />
                <Input placeholder="Locale" value={enqueueLocale} onChange={(e) => setEnqueueLocale(e.target.value)} />
                <Button variant="outline" onClick={async () => {
                  const base = process.env.NEXT_PUBLIC_AUTOMATION_BASE_URL || ""
                  const res = await fetch(`${base}/api/shorts/enqueue`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ topic: enqueueTopic, locale: enqueueLocale }) })
                  const data = await res.json()
                  if (data?.ok) refreshShortsFeed()
                }}>Enqueue</Button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input placeholder="Inspiration URL" value={inspireUrl} onChange={(e) => setInspireUrl(e.target.value)} />
                <Button variant="outline" onClick={async () => {
                  const base = process.env.NEXT_PUBLIC_AUTOMATION_BASE_URL || ""
                  const res = await fetch(`${base}/api/shorts/inspiration`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: inspireUrl, locale: enqueueLocale }) })
                  const data = await res.json()
                  if (data?.ok) {
                    setEnqueueTopic(data.topic)
                  }
                }}>Inspire</Button>
                <Button variant="premium" onClick={async () => {
                  const base = process.env.NEXT_PUBLIC_AUTOMATION_BASE_URL || ""
                  const res = await fetch(`${base}/api/shorts/enqueue`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ topic: enqueueTopic, locale: enqueueLocale }) })
                  const data = await res.json()
                  if (data?.ok) refreshShortsFeed()
                }}>Use & Enqueue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
