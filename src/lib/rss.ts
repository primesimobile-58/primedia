import Parser from 'rss-parser';
import { NewsItem, mockNews } from './data';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded'],
      ['dc:creator', 'creator'],
    ],
  },
});

type RSSSource = {
  [key: string]: { // lang
    [key: string]: string; // category -> url
  };
};

const RSS_SOURCES: RSSSource = {
  tr: {
    general: 'https://www.mynet.com/haber/rss/sondakika', // Mynet - Kullanıcı isteği üzerine gündem referansı
    world: 'https://feeds.bbci.co.uk/turkce/rss.xml', // BBC Türkçe - Global kalite
    technology: 'https://www.donanimhaber.com/rss/tum/', 
    sports: 'https://www.fotomac.com.tr/rss/anasayfa.xml', 
    magazine: 'https://www.milliyet.com.tr/rss/rssnew/magazinrss.xml', 
    economy: 'https://www.bloomberght.com/rss',
    health: 'https://www.cnnturk.com/feed/rss/saglik/news',
    culture: 'https://www.ntv.com.tr/sanat.rss',
  },
  en: {
    general: 'http://feeds.bbci.co.uk/news/rss.xml',
    world: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    technology: 'http://feeds.bbci.co.uk/news/technology/rss.xml',
    sports: 'http://feeds.bbci.co.uk/sport/rss.xml',
    economy: 'http://feeds.bbci.co.uk/news/business/rss.xml',
    health: 'http://feeds.bbci.co.uk/news/health/rss.xml',
    culture: 'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
  },
  ar: {
    general: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e', 
    world: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    technology: 'https://www.aljazeera.net/aljazeerarss/c4e88383-a795-40b9-b5c4-7d5264b38343',
    sports: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    economy: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    health: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    culture: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
  }
};

// Spam ve gereksiz haber filtresi (Asliye Ceza, İlan vb.)
const BLOCKED_KEYWORDS = [
  'asliye ceza', 'asliye ticaret', 'icra dairesi', 'satış memurluğu', 'ilan.gov.tr', 
  'ihale', 'vefat', 'başsağlığı', 'elektrik kesintisi', 'su kesintisi', 
  'nöbetçi eczane', 'hava durumu', 'namaz vakitleri',
  'müge anlı', 'esra erol', 'gelinim mutfakta', 'survivor kim elendi', // Reality show spam'i
  'banko kupon', 'iddaa tahmin', 'yasa dışı bahis', // Bahis spam'i
  'cinsel gücü', 'mucize karışım', 'göbek eriten' // Sağlık spam'i
];

function isSpamNews(title: string, summary: string): boolean {
  const text = (title + ' ' + summary).toLowerCase();
  return BLOCKED_KEYWORDS.some(keyword => text.includes(keyword));
}

// Fallback images (High quality, static URLs to avoid broken links)
const FALLBACK_IMAGES = {
  general: [
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop',
  ],
  world: [
    'https://images.unsplash.com/photo-1529243856184-fd5465488984?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
  ],
  economy: [
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=800&auto=format&fit=crop',
  ],
  magazine: [
    'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?q=80&w=800&auto=format&fit=crop',
  ],
  health: [
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
  ],
  culture: [
    'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=800&auto=format&fit=crop',
  ],
};

const getFallbackImage = (category: string, id: string, title?: string) => {
  // 1. Try to match keywords in title if available
  if (title) {
    const lowerTitle = title.toLowerCase();
    
    // Economy Keywords
    if (['dolar', 'euro', 'altın', 'borsa', 'faiz', 'enflasyon', 'ekonomi', 'banka', 'hisse', 'market', 'currency', 'gold', 'stock'].some(k => lowerTitle.includes(k))) {
      const images = FALLBACK_IMAGES.economy;
      return images[Math.abs(hashString(id)) % images.length];
    }
    
    // Sports Keywords
    if (['fenerbahçe', 'galatasaray', 'beşiktaş', 'trabzonspor', 'futbol', 'maç', 'lig', 'voleybol', 'basketbol', 'gol', 'transfer', 'sport', 'football', 'soccer'].some(k => lowerTitle.includes(k))) {
      const images = FALLBACK_IMAGES.sports;
      return images[Math.abs(hashString(id)) % images.length];
    }

    // Technology Keywords
    if (['apple', 'samsung', 'yapay zeka', 'ai', 'internet', 'teknoloji', 'telefon', 'bilgisayar', 'yazılım', 'kod', 'robot', 'uzay', 'nasa', 'tech', 'mobile'].some(k => lowerTitle.includes(k))) {
      const images = FALLBACK_IMAGES.technology;
      return images[Math.abs(hashString(id)) % images.length];
    }
    
    // World/Politics Keywords
    if (['abd', 'rusya', 'ukrayna', 'israil', 'gazze', 'trump', 'biden', 'putin', 'savaş', 'kriz', 'bm', 'nato', 'world', 'war'].some(k => lowerTitle.includes(k))) {
      const images = FALLBACK_IMAGES.world;
      return images[Math.abs(hashString(id)) % images.length];
    }
  }

  // 2. Fallback to category based
  const hash = hashString(id);
  const images = FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.general;
  return images[Math.abs(hash) % images.length];
};

const hashString = (str: string) => {
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
};

function extractImage(item: any): string {
  // Try to find image in various RSS standard fields
  if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url) {
    return item.mediaContent['$'].url;
  }
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  // Try parsing HTML content for <img src="...">
  const content = item.contentEncoded || item.content || item.description || '';
  const imgMatch = content.match(/src="([^"]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return '';
}

export async function getAllNews(lang: string): Promise<NewsItem[]> {
  const categories = Object.keys(RSS_SOURCES[lang] || RSS_SOURCES['tr']);
  const promises = categories.map(cat => fetchNews(lang, cat));
  const results = await Promise.all(promises);
  return results.flat();
}

export async function getNewsById(id: string, lang: string): Promise<NewsItem | undefined> {
  // Helper to match IDs robustly against encoding differences
  const isMatch = (newsId: string) => {
    return newsId === id || newsId === decodeURIComponent(id);
  };

  // 0. Check mockNews first (for static content)
  const mockFound = mockNews.find(n => isMatch(n.id));
  if (mockFound) return mockFound;

  // 1. Try fetching just the general/breaking first as it's most likely there
  let news = await fetchNews(lang, 'general');
  let found = news.find(n => isMatch(n.id));
  if (found) return found;

  // 2. If not found, fetch everything (heavy but necessary without DB)
  const allNews = await getAllNews(lang);
  return allNews.find(n => isMatch(n.id));
}

export async function fetchNews(lang: string, category: string = 'general'): Promise<NewsItem[]> {
  // Map internal categories to RSS source keys
  // Some slugs might differ from keys
  const categoryMap: {[key: string]: string} = {
    'gundem': 'general',
    'dunya': 'world',
    'teknoloji': 'technology',
    'spor': 'sports',
    'magazin': 'magazine',
    'ekonomi': 'economy',
    'saglik': 'health',
    'kultur-sanat': 'culture',
    // English mappings
    'agenda': 'general',
    // Keep existing keys working
    'general': 'general',
    'world': 'world',
    'technology': 'technology',
    'sports': 'sports',
    'magazine': 'magazine',
    'economy': 'economy',
    'health': 'health',
    'culture': 'culture',
  };

  const sourceKey = categoryMap[category] || category;
  const sourceUrl = RSS_SOURCES[lang]?.[sourceKey] || RSS_SOURCES[lang]?.['general'] || RSS_SOURCES['tr']['general'];
  
  try {
    const feed = await parser.parseURL(sourceUrl);
    
    return feed.items.map((item, index) => {
      const id = item.guid || item.link || index.toString();
      const extractedImage = extractImage(item);
      const imageUrl = extractedImage || getFallbackImage(sourceKey, id, item.title);
      
      // Clean up description (remove HTML tags if necessary, but some components render HTML)
      // For this project, we'll strip HTML for the summary to be safe
      const summary = ((item as any).description || item.contentSnippet || '').replace(/<[^>]+>/g, '').slice(0, 150) + '...';
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

      // Check for spam/boring content
      if (isSpamNews(item.title || '', summary)) {
        return null;
      }

      return {
        id: id, 
        title: item.title || 'Haber Başlığı',
        summary: summary,
        content: (item as any)['content:encoded'] || (item as any).content || (item as any).description || '', // Full content if available
        link: item.link, // Store original link
        category: category.charAt(0).toUpperCase() + category.slice(1), 
        imageUrl: imageUrl,
        date: pubDate.toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA'),
        time: pubDate.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' }),
        isHeadline: index < 5, 
        isBreaking: index < 3, 
      };
    }).filter(item => item !== null) as NewsItem[];
  } catch (error) {
    console.error(`Error fetching RSS for ${lang}/${category}:`, error);
    // FALLBACK: If RSS fails, return mock data for this category to avoid empty pages
    // Filter mockNews by category
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const mockFallback = mockNews.filter(n => n.category.toLowerCase() === category.toLowerCase());
    if (mockFallback.length > 0) {
       console.log(`Using mock fallback for ${category}`);
       return mockFallback;
    }
    return [];
  }
}
