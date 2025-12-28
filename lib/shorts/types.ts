export type TrendSignal = {
  source: string
  topic: string
  score: number
  locale?: string
}

export type TrendAggregate = {
  timestamp: number
  signals: TrendSignal[]
}

