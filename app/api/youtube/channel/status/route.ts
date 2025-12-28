import { getSecret } from "@/lib/secrets"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const cid = url.searchParams.get("channelId") || (await getSecret("youtube_channel_id")) || ""
  const apiKey = (await getSecret("youtube_api_key")) || ""
  if (!cid || !apiKey) return new Response(JSON.stringify({ ok: false, error: "missing_params" }), { status: 400, headers: { "content-type": "application/json" } })
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${cid}&key=${apiKey}`)
  const data = await res.json()
  const item = data?.items?.[0]
  const status = {
    title: item?.snippet?.title || "",
    subs: item?.statistics?.subscriberCount || "0",
    videos: item?.statistics?.videoCount || "0",
    views: item?.statistics?.viewCount || "0",
  }
  return new Response(JSON.stringify({ ok: true, channelId: cid, status, raw: item }), { status: 200, headers: { "content-type": "application/json" } })
}

