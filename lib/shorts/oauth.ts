type TokenSet = { access_token: string; refresh_token: string; expires_in: number }

export async function buildAuthUrl(clientId: string, redirectUri: string): Promise<string> {
  const scope = encodeURIComponent("https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly")
  const base = "https://accounts.google.com/o/oauth2/v2/auth"
  const url = `${base}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&access_type=offline&prompt=consent&scope=${scope}`
  return url
}

export async function exchangeCode(clientId: string, clientSecret: string, redirectUri: string, code: string): Promise<TokenSet> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code", code }).toString(),
  })
  const data = await res.json()
  return { access_token: data.access_token || "", refresh_token: data.refresh_token || "", expires_in: data.expires_in || 0 }
}

