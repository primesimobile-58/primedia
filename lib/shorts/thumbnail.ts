type FrameMeta = { time: number; face?: boolean; emotion?: string }

type ThumbnailCandidate = { frameTime: number; text: string; score: number }

export function generateCandidates(frames: FrameMeta[], textHints: string[]): ThumbnailCandidate[] {
  const list: ThumbnailCandidate[] = []
  for (const f of frames) {
    const text = textHints[0] || "Bilmen gerekenler"
    const base = f.face ? 0.6 : 0.4
    const boost = f.emotion ? 0.1 : 0
    list.push({ frameTime: f.time, text, score: Number((base + boost).toFixed(3)) })
  }
  return list.sort((a, b) => b.score - a.score)
}

export function pickForAB(candidates: ThumbnailCandidate[]): { a: ThumbnailCandidate; b: ThumbnailCandidate } {
  const a = candidates[0]
  const b = candidates[1] || candidates[0]
  return { a, b }
}

