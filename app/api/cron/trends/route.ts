import { fetchTrends } from "@/lib/shorts/trendRadar"
import { enqueuePersistent } from "@/lib/shorts/queueStore"

export const runtime = "nodejs"

export async function POST() {
  const agg = await fetchTrends()
  const top = agg.signals.slice(0, 5)
  for (const s of top) await enqueuePersistent(s.topic, s.locale || "US")
  return new Response(JSON.stringify({ ok: true, enqueued: top.length }), { status: 200, headers: { "content-type": "application/json" } })
}
