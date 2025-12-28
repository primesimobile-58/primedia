export const SHORTS_CONFIG = {
  youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
  googleTrendsToken: process.env.GOOGLE_TRENDS_TOKEN || "",
  redditToken: process.env.REDDIT_TOKEN || "",
}

export function hasSecrets() {
  return Boolean(SHORTS_CONFIG.youtubeApiKey)
}

