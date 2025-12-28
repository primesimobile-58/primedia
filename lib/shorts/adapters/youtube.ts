export async function fetchMostPopular(regionCode: string) {
  const key = process.env.YOUTUBE_API_KEY || ""
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=${regionCode}&maxResults=50&key=${key}`
  const res = await fetch(url)
  const data = await res.json()
  return data
}

