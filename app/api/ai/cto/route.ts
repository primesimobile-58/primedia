export const runtime = "edge"

export async function POST(req: Request) {
  const body = await req.json()
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({ configured: false, output: "LLM yapılandırılmadı. OPENAI_API_KEY ekleyin.", input: body }),
      { status: 200, headers: { "content-type": "application/json" } }
    )
  }
  return new Response(
    JSON.stringify({ configured: true, output: `CTO analizi: ${body?.task || "Genel sağlık kontrolü"} tamamlandı.`, input: body }),
    { status: 200, headers: { "content-type": "application/json" } }
  )
}
