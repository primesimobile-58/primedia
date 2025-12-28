export async function fetchTopQueries(geo: string) {
  const token = process.env.GOOGLE_TRENDS_TOKEN || ""
  const url = `https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=-180&geo=${geo}`
  const res = await fetch(url, { headers: { authorization: token ? `Bearer ${token}` : undefined } as any })
  const text = await res.text()
  return text
}

