import { getSecret } from "@/lib/secrets"
import { buildHashtags } from "@/lib/shorts/metadata"

export const runtime = "nodejs"

function extractId(u: string): string | null {
  try {
    const url = new URL(u)
    if (url.hostname.includes("youtu.be")) return url.pathname.split("/")[1] || null
    if (url.pathname.includes("/shorts/")) return url.pathname.split("/shorts/")[1]?.split("/")[0] || null
    if (url.searchParams.get("v")) return url.searchParams.get("v")
    return null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const url = body?.url || ""
  const id = extractId(url)
  if (!id) return new Response(JSON.stringify({ ok: false, error: "invalid_url" }), { status: 400, headers: { "content-type": "application/json" } })
  const apiKey = (await getSecret("youtube_api_key")) || ""
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`)
  const data = await res.json()
  const item = data?.items?.[0]
  const title = item?.snippet?.title || ""
  const topic = title.replace(/[#|]/g, " ").trim()
  const tags = buildHashtags(topic, body?.locale || "US")
  return new Response(JSON.stringify({ ok: true, videoId: id, topic, tags, raw: item }), { status: 200, headers: { "content-type": "application/json" } })
}

