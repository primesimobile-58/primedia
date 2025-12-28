import { storeSecret } from "@/lib/secrets"
import { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const youtube = body?.youtube || {}
  const entries = [
    ["youtube_client_id", youtube.clientId],
    ["youtube_client_secret", youtube.clientSecret],
    ["youtube_redirect_uri", youtube.redirectUri],
    ["youtube_api_key", youtube.apiKey],
    ["youtube_channel_id", youtube.channelId],
    ["youtube_user_id", youtube.userId],
  ].filter(([, v]) => typeof v === "string" && v.length > 0) as Array<[string, string]>
  for (const [name, value] of entries) await storeSecret(name, value)
  return new Response(JSON.stringify({ ok: true, saved: entries.map(([n]) => n) }), { status: 200, headers: { "content-type": "application/json" } })
}
