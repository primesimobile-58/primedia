import { schedulePublish } from "@/lib/shorts/publisher"
import { composeTitle, composeDescription, buildHashtags } from "@/lib/shorts/metadata"

export const runtime = "edge"

export async function POST(req: Request) {
  const body = await req.json()
  const topic = body?.topic || ""
  const locale = body?.locale
  const title = composeTitle(topic)
  const description = composeDescription(topic)
  const tags = buildHashtags(topic, locale)
  const payload = schedulePublish({ title, description, tags, filePath: "/tmp/placeholder.mp4" })
  return new Response(JSON.stringify({ ok: true, payload }), { status: 200, headers: { "content-type": "application/json" } })
}

