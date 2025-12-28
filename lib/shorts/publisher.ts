type PublishRequest = {
  title: string
  description: string
  tags: string[]
  filePath: string
  publishAt?: string
}

type PublishPayload = {
  snippet: { title: string; description: string; tags: string[]; categoryId: string }
  status: { privacyStatus: "private" | "public"; publishAt?: string; madeForKids: boolean }
}

export function schedulePublish(req: PublishRequest): PublishPayload {
  const snippet = { title: req.title, description: req.description, tags: req.tags, categoryId: "24" }
  const status = { privacyStatus: "private" as const, publishAt: req.publishAt, madeForKids: false }
  return { snippet, status }
}

