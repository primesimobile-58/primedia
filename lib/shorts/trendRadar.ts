import { TrendAggregate, TrendSignal } from "./types"

const regionCodes = ["US", "GB", "IN", "TR", "ES", "BR"]

export async function fetchTrends(): Promise<TrendAggregate> {
  const signals: TrendSignal[] = []
  const now = Date.now()
  for (const r of regionCodes) {
    signals.push({ source: "YouTube", topic: `mostPopular:${r}`, score: 0.7, locale: r })
    signals.push({ source: "GoogleTrends", topic: `top:${r}`, score: 0.6, locale: r })
    signals.push({ source: "Reddit", topic: `hot:${r}`, score: 0.5, locale: r })
  }
  return { timestamp: now, signals: scoreSignals(signals) }
}

export function scoreSignals(signals: TrendSignal[]): TrendSignal[] {
  return signals
    .map(s => ({ ...s, score: normalizeScore(s.score) }))
    .sort((a, b) => b.score - a.score)
}

function normalizeScore(x: number): number {
  if (x < 0) return 0
  if (x > 1) return 1
  return Number(x.toFixed(3))
}

