import { createServerClient } from "@/lib/supabase"
import { getSecret } from "@/lib/secrets"
import { NextRequest } from "next/server"
import fs from "fs"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const title = body?.title || ""
    const description = body?.description || ""
    const tags = (body?.tags as string[]) || []
    const filePath = body?.filePath || ""

    if (!title || !filePath) return new Response(JSON.stringify({ ok: false, error: "missing_fields" }), { status: 400, headers: { "content-type": "application/json" } })

    const supa = createServerClient()
    const { data } = await supa.from("oauth_tokens").select("refresh_token").eq("provider", "youtube").limit(1)
    const refreshToken = data?.[0]?.refresh_token || ""
    if (!refreshToken) return new Response(JSON.stringify({ ok: false, error: "no_refresh_token" }), { status: 400, headers: { "content-type": "application/json" } })

    const clientId = (await getSecret("youtube_client_id")) || ""
    const clientSecret = (await getSecret("youtube_client_secret")) || ""
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "refresh_token", refresh_token: refreshToken }).toString(),
    })
    const tokenData = await tokenRes.json()
    const accessToken = tokenData?.access_token || ""
    if (!accessToken) return new Response(JSON.stringify({ ok: false, error: "no_access_token" }), { status: 400, headers: { "content-type": "application/json" } })

    const snippet = { title, description, tags, categoryId: "24" }
    const status = { privacyStatus: "private", madeForKids: false }
    const meta = { snippet, status }

    const sessionRes = await fetch("https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json; charset=UTF-8",
        "x-upload-content-type": "video/mp4",
      },
      body: JSON.stringify(meta),
    })
    if (!sessionRes.ok) {
      const err = await sessionRes.text()
      return new Response(JSON.stringify({ ok: false, error: "session_failed", detail: err }), { status: 500, headers: { "content-type": "application/json" } })
    }
    const uploadUrl = sessionRes.headers.get("location") || ""
    if (!uploadUrl) return new Response(JSON.stringify({ ok: false, error: "no_upload_url" }), { status: 500, headers: { "content-type": "application/json" } })

    let fileBuf: Buffer
    if (filePath) {
      fileBuf = fs.readFileSync(filePath)
    } else {
      const fileUrl = body?.fileUrl || ""
      if (!fileUrl) return new Response(JSON.stringify({ ok: false, error: "missing_file" }), { status: 400, headers: { "content-type": "application/json" } })
      const fileRes = await fetch(fileUrl)
      const arr = new Uint8Array(await fileRes.arrayBuffer())
      fileBuf = Buffer.from(arr)
    }
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "video/mp4",
        "content-length": String(fileBuf.length),
      },
      body: fileBuf,
    })
    const resultText = await putRes.text()
    if (!putRes.ok) return new Response(JSON.stringify({ ok: false, error: "upload_failed", detail: resultText }), { status: 500, headers: { "content-type": "application/json" } })

    return new Response(JSON.stringify({ ok: true, result: resultText }), { status: 200, headers: { "content-type": "application/json" } })
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: "exception", detail: e?.message || String(e) }), { status: 500, headers: { "content-type": "application/json" } })
  }
}
