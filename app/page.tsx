"use client"

import { Suspense } from "react"
import HomepageContent from "@/components/homepage-content"

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <HomepageContent />
    </Suspense>
  )
}