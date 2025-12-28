type Source = { name: string; license?: string }

export function checkLicense(src: Source): { ok: boolean; reason?: string } {
  if (!src.license) return { ok: false, reason: "license_missing" }
  const allowed = ["CC-BY", "CC0", "owned"]
  if (!allowed.includes(src.license)) return { ok: false, reason: "license_not_allowed" }
  return { ok: true }
}

export function checkPolicies(text: string): { ok: boolean; flags: string[] } {
  const banned = ["nefret", "şiddet çağrısı"]
  const flags = banned.filter(k => text.toLowerCase().includes(k))
  return { ok: flags.length === 0, flags }
}

