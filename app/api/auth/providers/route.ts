export const runtime = "nodejs"

function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    service: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export async function GET() {
  const { url, service } = env()
  if (!url || !service) {
    return new Response(JSON.stringify({ ok: false, configured: false, googleEnabled: false, appleEnabled: false }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: {
        Authorization: `Bearer ${service}`,
        apikey: service,
      },
    })
    const data = await res.json().catch(() => ({}))
    const external = (data?.external || {}) as any
    const googleEnabled = Boolean(external?.google?.enabled || external?.google)
    const appleEnabled = Boolean(external?.apple?.enabled || external?.apple)
    return new Response(JSON.stringify({ ok: true, configured: true, googleEnabled, appleEnabled }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, configured: false, googleEnabled: false, appleEnabled: false }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }
}
