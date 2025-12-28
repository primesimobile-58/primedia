type Metrics = { views: number; ctr: number; retentionSec: number; rpm: number }

export function summarize(metrics: Metrics[]) {
  const n = metrics.length || 1
  const sum = metrics.reduce(
    (a, m) => ({ views: a.views + m.views, ctr: a.ctr + m.ctr, retentionSec: a.retentionSec + m.retentionSec, rpm: a.rpm + m.rpm }),
    { views: 0, ctr: 0, retentionSec: 0, rpm: 0 }
  )
  return {
    avgCtr: Number((sum.ctr / n).toFixed(3)),
    avgRetentionSec: Number((sum.retentionSec / n).toFixed(1)),
    totalViews: sum.views,
    avgRpm: Number((sum.rpm / n).toFixed(2)),
  }
}

export function decideScale(sum: { totalViews: number; avgCtr: number; avgRetentionSec: number }) {
  if (sum.totalViews > 100000 && sum.avgCtr > 0.08 && sum.avgRetentionSec > 20) return "scale"
  return "hold"
}

