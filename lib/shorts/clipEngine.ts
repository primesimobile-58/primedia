type Segment = { start: number; end: number; score: number }

export function selectHighlights(segments: Segment[], maxDurationSec = 60): Segment[] {
  const sorted = segments.sort((a, b) => b.score - a.score)
  const pick: Segment[] = []
  let total = 0
  for (const s of sorted) {
    const dur = Math.max(0, s.end - s.start)
    if (total + dur <= maxDurationSec) {
      pick.push(s)
      total += dur
    }
  }
  return pick
}

export function assembleShort(segments: Segment[]): { timeline: Segment[]; aspect: "9:16" } {
  return { timeline: segments, aspect: "9:16" }
}

