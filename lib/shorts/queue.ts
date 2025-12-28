type QueueItem = { id: string; topic: string; locale?: string }

const q: QueueItem[] = []

export function enqueue(item: QueueItem) {
  q.push(item)
}

export function dequeue(): QueueItem | undefined {
  return q.shift()
}

export function size() {
  return q.length
}

export function assignAB(id: string): "A" | "B" {
  return hash(id) % 2 === 0 ? "A" : "B"
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return Math.abs(h)
}

