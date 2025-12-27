import { NextResponse } from 'next/server'
import { getAllNews } from '@/lib/rss'
import { upsertNewsBatch } from '@/lib/news-service'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const lang = url.searchParams.get('lang') || 'tr'
  const items = await getAllNews(lang)
  await upsertNewsBatch(items)
  return NextResponse.json({ ok: true, lang, imported: items.length })
}
