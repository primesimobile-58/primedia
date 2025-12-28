export const runtime = "edge"

function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { url, anon } = env()
  if (!url || !anon) {
    return new Response(JSON.stringify({ configured: false, message: "Supabase yapılandırılmadı" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    })
  }
  const res = await fetch(`${url}/rest/v1/newsletter_subscriptions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return new Response(JSON.stringify({ configured: true, data }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}
