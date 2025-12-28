export function info(msg: string, data?: any) {
  console.log(`[INFO] ${msg}`, data || "")
}

export function warn(msg: string, data?: any) {
  console.warn(`[WARN] ${msg}`, data || "")
}

export function error(msg: string, data?: any) {
  console.error(`[ERROR] ${msg}`, data || "")
}

