export const runtime = "edge"

const state = { contentFeed: "idle", siteControl: "idle" }

export async function GET() {
  return new Response(JSON.stringify(state), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  const target = body?.engine
  const action = body?.action
  if (target === "contentFeed" && ["start", "stop"].includes(action)) state.contentFeed = action
  if (target === "siteControl" && ["start", "stop"].includes(action)) state.siteControl = action
  return new Response(JSON.stringify({ ok: true, state }), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}
