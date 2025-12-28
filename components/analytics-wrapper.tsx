'use client'

import { Suspense } from 'react'
import { useAnalytics } from '@/hooks/use-analytics'

interface AnalyticsWrapperProps {
  children: (analytics: ReturnType<typeof useAnalytics>) => React.ReactNode
}

function AnalyticsContent({ children }: AnalyticsWrapperProps) {
  const analytics = useAnalytics()
  return <>{children(analytics)}</>
}

export default function AnalyticsWrapper({ children }: AnalyticsWrapperProps) {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent>{children}</AnalyticsContent>
    </Suspense>
  )
}