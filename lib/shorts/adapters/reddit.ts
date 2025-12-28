export async function fetchHot(sub: string) {
  const token = process.env.REDDIT_TOKEN || ""
  const url = `https://oauth.reddit.com/r/${sub}/hot?limit=50`
  const headers: HeadersInit = token ? { authorization: `Bearer ${token}` } : {}
  const res = await fetch(url, { headers })
  const data = await res.json()
  return data
}

