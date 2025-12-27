import { NextResponse } from 'next/server'
import { getAllNews } from '@/lib/rss'
import { upsertNewsBatch } from '@/lib/news-service'

export async function GET() {
  const langs = ['tr', 'en', 'ar']
  let total = 0
  for (const lang of langs) {
    const items = await getAllNews(lang)
    total += items.length
    await upsertNewsBatch(items)
  }
  return NextResponse.json({ ok: true, langs, imported: total })
}
