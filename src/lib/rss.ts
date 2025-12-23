import Parser from 'rss-parser';
import { NewsItem } from './data';

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
    general: 'https://www.cnnturk.com/feed/rss/all/news',
    world: 'https://www.cnnturk.com/feed/rss/dunya/news',
    technology: 'https://www.donanimhaber.com/rss/tum/',
    sports: 'https://www.fotomac.com.tr/rss/anasayfa.xml',
    magazine: 'https://www.cnnturk.com/feed/rss/magazin/news',
    economy: 'https://www.cnnturk.com/feed/rss/ekonomi/news',
    health: 'https://www.cnnturk.com/feed/rss/saglik/news',
    culture: 'https://www.cnnturk.com/feed/rss/kultur-sanat/news',
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
    general: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e', // Top News
    world: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    technology: 'https://www.aljazeera.net/aljazeerarss/c4e88383-a795-40b9-b5c4-7d5264b38343', // Sci-Tech
    sports: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    economy: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    health: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
    culture: 'https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e',
  }
};

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

const getFallbackImage = (category: string, id: string) => {
  // Use a hash of the ID to pick a deterministic image from the array
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const images = FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES] || FALLBACK_IMAGES.general;
  return images[hash % images.length];
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
      const imageUrl = extractedImage || getFallbackImage(sourceKey, id);
      
      // Clean up description (remove HTML tags if necessary, but some components render HTML)
      // For this project, we'll strip HTML for the summary to be safe
      const summary = ((item as any).description || item.contentSnippet || '').replace(/<[^>]+>/g, '').slice(0, 150) + '...';
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

      return {
        id: id, 
        title: item.title || 'Haber Başlığı',
        summary: summary,
        category: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize
        imageUrl: imageUrl,
        date: pubDate.toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA'),
        time: pubDate.toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' }),
        isHeadline: index < 5, // First 5 items are headlines
        isBreaking: index < 3, // First 3 items are breaking
      };
    });
  } catch (error) {
    console.error(`Error fetching RSS for ${lang}/${category}:`, error);
    return [];
  }
}
