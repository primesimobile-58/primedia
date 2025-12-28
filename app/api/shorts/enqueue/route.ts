import { enqueuePersistent } from "@/lib/shorts/queueStore"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const body = await req.json()
  const topic = body?.topic || ""
  const locale = body?.locale || "US"
  if (!topic) return new Response(JSON.stringify({ ok: false, error: "missing_topic" }), { status: 400, headers: { "content-type": "application/json" } })
  const id = await enqueuePersistent(topic, locale)
  return new Response(JSON.stringify({ ok: true, id }), { status: 200, headers: { "content-type": "application/json" } })
}
