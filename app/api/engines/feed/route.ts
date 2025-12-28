export const runtime = "edge"

const sampleFeed = {
  timestamp: Date.now(),
  sources: [
    { name: "CampaignPerformance", status: "ok", items: 12 },
    { name: "AudienceGrowth", status: "ok", items: 5 },
    { name: "SearchTrends", status: "ok", items: 8 },
  ],
}

export async function GET() {
  return new Response(JSON.stringify(sampleFeed), {
    status: 200,
    headers: { "content-type": "application/json" },
  })
}

export async function POST(req: Request) {
  const body = await req.json()
  return new Response(
    JSON.stringify({ ok: true, action: body?.action || "refresh", at: Date.now() }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}
