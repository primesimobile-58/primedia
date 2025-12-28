"use client"

import { useEffect, useRef, useState } from "react"

export default function ChartContainer({ children, height = 300 }: { children: React.ReactNode, height?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = e.contentRect.width
        const h = e.contentRect.height
        if (w > 0 && h >= 0) setReady(true)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={ref} style={{ minWidth: 0, minHeight: height }}>
      {ready ? children : null}
    </div>
  )
}
