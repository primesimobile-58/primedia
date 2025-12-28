import { nextQueued, markProcessing, markDone, markFailed } from "@/lib/shorts/queueStore"
import { schedulePublish } from "@/lib/shorts/publisher"
import { composeTitle, composeDescription, buildHashtags } from "@/lib/shorts/metadata"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const cfg = await req.json().catch(() => ({} as any))
  const fileUrl: string = cfg?.fileUrl || "https://filesamples.com/samples/video/mp4/sample_640x360.mp4"
  const item = await nextQueued()
  if (!item) return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200, headers: { "content-type": "application/json" } })
  await markProcessing(item.id)
  try {
    const title = composeTitle(item.topic)
    const description = composeDescription(item.topic)
    const tags = buildHashtags(item.topic, item.locale)
    const payload = schedulePublish({ title, description, tags, filePath: fileUrl })
    const base = req.nextUrl.origin
    const uploadRes = await fetch(`${base}/api/publish/upload`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title, description, tags, fileUrl }),
    })
    const result = await uploadRes.json().catch(() => ({}))
    await markDone(item.id, { payload, result })
    return new Response(JSON.stringify({ ok: true, id: item.id, result }), { status: 200, headers: { "content-type": "application/json" } })
  } catch (e: any) {
    await markFailed(item.id, { error: e?.message || String(e) })
    return new Response(JSON.stringify({ ok: false, id: item.id, error: e?.message || String(e) }), { status: 500, headers: { "content-type": "application/json" } })
  }
}
