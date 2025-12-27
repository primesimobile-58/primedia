import fs from 'fs/promises';
import path from 'path';
import { NewsItem } from './data';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    await ensureDataDir();
    const fileContent = await fs.readFile(NEWS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading news:', error);
    // Fallback or empty array
    return [];
  }
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  const news = await getNews();
  return news.find(item => item.id === id);
}

export async function incrementViewCount(id: string): Promise<number> {
  try {
    const news = await getNews();
    const index = news.findIndex(item => item.id === id);
    
    if (index !== -1) {
      news[index].viewCount = (news[index].viewCount || 0) + 1;
      await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2));
      return news[index].viewCount || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return 0;
  }
}

export async function addNews(item: NewsItem): Promise<boolean> {
  try {
    const news = await getNews();
    news.unshift(item);
    await fs.writeFile(NEWS_FILE, JSON.stringify(news, null, 2));
    return true;
  } catch (error) {
    console.error('Error adding news:', error);
    throw error;
  }
}

function parseDate(dateStr: string, timeStr: string): Date {
  try {
    const [day, month, year] = dateStr.split('.').map((v) => parseInt(v));
    const [hour, minute] = timeStr.split(':').map((v) => parseInt(v));
    return new Date(year, month - 1, day, hour, minute);
  } catch {
    return new Date();
  }
}

export async function upsertNewsBatch(items: NewsItem[], maxItems: number = 500): Promise<void> {
  const existing = await getNews();
  const indexById = new Map<string, NewsItem>();
  existing.forEach((n) => indexById.set(n.id, n));
  items.forEach((n) => {
    if (!indexById.has(n.id)) {
      indexById.set(n.id, n);
    }
  });
  const merged = Array.from(indexById.values());
  merged.sort((a, b) => parseDate(b.date, b.time).getTime() - parseDate(a.date, a.time).getTime());
  const limited = merged.slice(0, maxItems);
  // Reindex flags to surface premium content like CNN Global
  const reindexed = reindexFlags(limited);
  await fs.writeFile(NEWS_FILE, JSON.stringify(reindexed, null, 2));
}

export function reindexFlags(list: NewsItem[]): NewsItem[] {
  // Weighted sort: recency first, then viewCount
  const scored = list.map((n) => {
    const recencyScore = parseDate(n.date, n.time).getTime();
    const views = n.viewCount || 0;
    const score = recencyScore + views * 1000; // weight views modestly
    return { n, score };
  }).sort((a, b) => b.score - a.score).map(({ n }) => n);

  return scored.map((n, i) => ({
    ...n,
    isHeadline: i < 7, // show more headlines like global portals
    isBreaking: i < 3,
  }));
}
