import { getSecret } from "@/lib/secrets"

export const runtime = "nodejs"

export async function GET() {
  const keys = ["youtube_client_id", "youtube_client_secret", "youtube_redirect_uri", "youtube_api_key", "youtube_channel_id", "youtube_user_id"]
  const result: Record<string, boolean> = {}
  for (const k of keys) result[k] = Boolean(await getSecret(k))
  return new Response(JSON.stringify({ ok: true, status: result }), { status: 200, headers: { "content-type": "application/json" } })
}
