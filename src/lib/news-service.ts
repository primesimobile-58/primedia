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
  await fs.writeFile(NEWS_FILE, JSON.stringify(limited, null, 2));
}
