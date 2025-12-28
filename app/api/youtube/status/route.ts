import { createServerClient } from "@/lib/supabase"

export const runtime = "edge"

export async function GET() {
  const supa = createServerClient()
  const { data } = await supa.from("oauth_tokens").select("id").eq("provider", "youtube").limit(1)
  const connected = Boolean(data && data.length > 0)
  return new Response(JSON.stringify({ connected }), { status: 200, headers: { "content-type": "application/json" } })
}

