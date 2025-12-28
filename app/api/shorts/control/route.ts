export const runtime = "edge"

const state = { shorts: "idle" }

export async function GET() {
  return new Response(JSON.stringify(state), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const action = body?.action
  if (["start", "stop"].includes(action)) state.shorts = action
  return new Response(JSON.stringify({ ok: true, state }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

