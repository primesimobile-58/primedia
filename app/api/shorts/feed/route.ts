export const runtime = "nodejs"

import { createServerClient } from "@/lib/supabase"
import { memQueueSize } from "@/lib/shorts/queueStore"

export async function GET() {
  let queued = 0, done = 0
  try {
    const supa = createServerClient()
    const [{ count: q }, { count: d }] = await Promise.all([
      supa.from("shorts_queue").select("id", { count: "exact", head: true }).eq("status", "queued"),
      supa.from("shorts_queue").select("id", { count: "exact", head: true }).eq("status", "done").gte("created_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString()),
    ])
    queued = q || 0
    done = d || 0
  } catch {
    queued = memQueueSize()
  }
  const feed = {
    timestamp: Date.now(),
    sources: [
      { name: "TrendRadar", status: "ok", items: 0 },
      { name: "Queue", status: "ok", items: queued || 0 },
      { name: "PublishedToday", status: "ok", items: done || 0 },
    ],
  }
  return new Response(JSON.stringify(feed), { status: 200, headers: { "content-type": "application/json" } })
}

export async function POST(req: Request) {
  const body = await req.json()
  return new Response(
    JSON.stringify({ ok: true, action: body?.action || "refresh", at: Date.now() }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}
