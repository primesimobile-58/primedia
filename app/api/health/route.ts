export const runtime = "nodejs"

function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export async function GET() {
  const { url, anon, service } = env()
  let providers = { googleEnabled: false, appleEnabled: false }
  if (url && service) {
    try {
      const res = await fetch(`${url}/auth/v1/settings`, { headers: { Authorization: `Bearer ${service}`, apikey: service } })
      const data = await res.json().catch(() => ({}))
      const external = (data?.external || {}) as any
      providers.googleEnabled = Boolean(external?.google?.enabled || external?.google)
      providers.appleEnabled = Boolean(external?.apple?.enabled || external?.apple)
    } catch {}
  }
  return new Response(JSON.stringify({ ok: true, env: { supabaseUrl: Boolean(url), supabaseAnon: Boolean(anon), supabaseService: Boolean(service) }, providers }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}
