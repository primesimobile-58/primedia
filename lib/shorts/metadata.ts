export function buildHashtags(topic: string, locale?: string): string[] {
  const base = ["#shorts", "#trend"]
  const topicTag = `#${topic.split(" ").join("")}`
  const localeTag = locale ? `#${locale.toLowerCase()}` : undefined
  return [...base, topicTag, ...(localeTag ? [localeTag] : [])]
}

export function composeTitle(topic: string): string {
  return `${topic} hakkında 60 saniyede öz bilgi`
}

export function composeDescription(topic: string): string {
  return `${topic} için en güncel kısa özet. Daha fazlası için abone ol.`
}

