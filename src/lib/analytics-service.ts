import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

export interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  visitsByCountry: Record<string, number>;
  topReferrers: Record<string, number>;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    await ensureDataDir();
    const fileContent = await fs.readFile(ANALYTICS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If file doesn't exist, return default structure
    return {
      totalVisits: 0,
      todayVisits: 0,
      visitsByCountry: {},
      topReferrers: {}
    };
  }
}

export async function trackVisit(countryCode: string = 'TR', referrer: string = 'direct') {
  try {
    const data = await getAnalytics();
    
    data.totalVisits++;
    data.todayVisits++;
    
    // Track Country
    if (!data.visitsByCountry[countryCode]) data.visitsByCountry[countryCode] = 0;
    data.visitsByCountry[countryCode]++;
    
    // Track Referrer
    if (!data.topReferrers[referrer]) data.topReferrers[referrer] = 0;
    data.topReferrers[referrer]++;
    
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
}
