import crypto from "crypto"
import { createServerClient } from "./supabase"

function keyBytes(): Buffer {
  const secret = process.env.ALYA_SECRETS_KEY || ""
  return crypto.createHash("sha256").update(secret).digest()
}

export function encrypt(value: string) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBytes(), iv)
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return { iv: iv.toString("base64"), data: enc.toString("base64"), tag: tag.toString("base64") }
}

export function decrypt(payload: { iv: string; data: string; tag: string }) {
  const iv = Buffer.from(payload.iv, "base64")
  const data = Buffer.from(payload.data, "base64")
  const tag = Buffer.from(payload.tag, "base64")
  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBytes(), iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString("utf8")
}

export async function storeSecret(name: string, value: string) {
  const supa = createServerClient()
  const payload = encrypt(value)
  await supa.from("secrets").upsert({ name, value_encrypted: payload })
}

export async function getSecret(name: string): Promise<string | null> {
  const supa = createServerClient()
  const { data } = await supa.from("secrets").select("value_encrypted").eq("name", name).limit(1)
  const payload = data?.[0]?.value_encrypted
  if (!payload) return null
  return decrypt(payload)
}

