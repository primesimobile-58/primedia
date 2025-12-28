import { exchangeCode } from "@/lib/shorts/oauth"
import { createServerClient } from "@/lib/supabase"
import { getSecret } from "@/lib/secrets"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const body = await req.json()
  const code = body?.code || ""
  const clientId = (await getSecret("youtube_client_id")) || ""
  const clientSecret = (await getSecret("youtube_client_secret")) || ""
  const redirectUri = (await getSecret("youtube_redirect_uri")) || ""
  const tokens = await exchangeCode(clientId, clientSecret, redirectUri, code)
  const supa = createServerClient()
  await supa.from("oauth_tokens").upsert({ provider: "youtube", refresh_token: tokens.refresh_token })
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } })
}
