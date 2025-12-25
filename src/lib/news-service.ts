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
