import { createServerClient } from "@/lib/supabase"

const memQ: Array<{ id: string; topic: string; locale: string; variant: "A" | "B" }> = []
function supaReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

export async function enqueuePersistent(topic: string, locale = "US", variant: "A" | "B" = "A") {
  if (!supaReady()) {
    const id = `${topic}:${Date.now()}`
    memQ.push({ id, topic, locale, variant })
    return id
  }
  const supa = createServerClient()
  const { data, error } = await supa.from("shorts_queue").insert({ topic, locale, variant, status: "queued" }).select("id").single()
  if (error) throw error
  return data.id as string
}

export async function nextQueued() {
  if (!supaReady()) {
    return memQ.shift() || null
  }
  const supa = createServerClient()
  const { data } = await supa.from("shorts_queue").select("id,topic,locale,variant").eq("status", "queued").order("created_at", { ascending: true }).limit(1)
  return data?.[0] || null
}

export async function markProcessing(id: string) {
  if (!supaReady()) return
  const supa = createServerClient()
  await supa.from("shorts_queue").update({ status: "processing", updated_at: new Date().toISOString() }).eq("id", id)
}

export async function markDone(id: string, result: any) {
  if (!supaReady()) return
  const supa = createServerClient()
  await supa.from("shorts_queue").update({ status: "done", result, updated_at: new Date().toISOString() }).eq("id", id)
}

export async function markFailed(id: string, result: any) {
  if (!supaReady()) return
  const supa = createServerClient()
  await supa.from("shorts_queue").update({ status: "failed", result, updated_at: new Date().toISOString() }).eq("id", id)
}

export function memQueueSize() { return memQ.length }
