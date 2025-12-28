"use client"

import { useEffect, useRef } from "react"

export default function ConsoleFilter() {
  const originalError = useRef<(...args: any[]) => void>()
  const originalWarn = useRef<(...args: any[]) => void>()

  useEffect(() => {
    originalError.current = console.error
    originalWarn.current = console.warn

    console.error = (...args: any[]) => {
      const msg = String(args[0] ?? "")
      if (
        msg.includes("net::ERR_ABORTED") ||
        msg.includes("DialogContent requires a DialogTitle")
      ) {
        return
      }
      originalError.current?.(...args)
    }

    console.warn = (...args: any[]) => {
      const msg = String(args[0] ?? "")
      if (
        msg.includes("width(-1) and height(-1)") ||
        msg.includes("prefetch")
      ) {
        return
      }
      originalWarn.current?.(...args)
    }

    return () => {
      if (originalError.current) console.error = originalError.current
      if (originalWarn.current) console.warn = originalWarn.current
    }
  }, [])

  return null
}
