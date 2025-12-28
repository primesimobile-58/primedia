import { buildAuthUrl } from "@/lib/shorts/oauth"
import { getSecret } from "@/lib/secrets"

export const runtime = "nodejs"

export async function GET() {
  const clientId = (await getSecret("youtube_client_id")) || ""
  const redirectUri = (await getSecret("youtube_redirect_uri")) || ""
  const url = await buildAuthUrl(clientId, redirectUri)
  return new Response(JSON.stringify({ url }), { status: 200, headers: { "content-type": "application/json" } })
}
