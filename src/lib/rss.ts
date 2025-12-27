// Lightweight RSS parsing without `url.parse()` to avoid DEP0169 warnings
import { NewsItem, mockNews, CUSTOM_NEWS_ITEM } from './data';
import { getNews as getLocalNews } from './news-service';

function stripCDATA(value: string = ''): string {
  return value.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
}

type RawRSSItem = {
  title?: string;
  link?: string;
  description?: string;
  contentEncoded?: string;
  pubDate?: string;
  enclosure?: { url?: string };
  mediaContent?: { $?: { url?: string } };
};

async function fetchRss(url: string): Promise<{ items: RawRSSItem[] }> {
  const res = await fetch(url);
  const xml = await res.text();
  const items: RawRSSItem[] = [];

  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const tag = (src: string, name: string) => {
    const m = src.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\/${name}>`, 'i'));
    return m ? stripCDATA(m[1]) : undefined;
  };

  const enclosureRegex = /<enclosure[^>]*url="([^"]+)"[^>]*\/?>(?:<\/enclosure>)?/i;
  const mediaRegex = /<media:content[^>]*url="([^"]+)"[^>]*\/?>(?:<\/media:content>)?/i;

  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[0];
    const item: RawRSSItem = {
      title: tag(block, 'title'),
      link: tag(block, 'link'),
      description: tag(block, 'description'),
      contentEncoded: tag(block, 'content:encoded'),
      pubDate: tag(block, 'pubDate'),
    };
    const enc = block.match(enclosureRegex);
    if (enc) item.enclosure = { url: enc[1] };
    const med = block.match(mediaRegex);
    if (med) item.mediaContent = { $: { url: med[1] } } as any;
    items.push(item);
  }

  return { items };
}

type RSSSource = {
  [key: string]: { // lang
    [key: string]: string[]; // category -> url[]
  };
};

const RSS_SOURCES: RSSSource = {
  tr: {
    general: [
      'https://www.mynet.com/haber/rss/sondakika',
      'https://www.hurriyet.com.tr/rss/anasayfa',
      'https://www.milliyet.com.tr/rss/rssnew/sondakikarss.xml',
      'https://www.sabah.com.tr/rss/anasayfa.xml',
      'https://www.haberturk.com/rss/manset.xml',
      'https://www.cnnturk.com/feed/rss/all/news',
      'https://www.cumhuriyet.com.tr/rss/son_dakika.xml'
    ],
    world: [
      'https://feeds.bbci.co.uk/turkce/rss.xml',
      'https://rss.dw.com/xml/rss-tur-all',
      'https://tr.euronews.com/rss'
    ],
    technology: [
      'https://www.donanimhaber.com/rss/tum/',
      'https://www.webtekno.com/rss.xml',
      'https://shiftdelete.net/feed',
      'https://www.technopat.net/feed/'
    ],
    sports: [
      'https://www.fotomac.com.tr/rss/anasayfa.xml',
      'https://www.sabah.com.tr/rss/spor.xml',
      'https://www.trtspor.com.tr/rss',
      'https://www.aspor.com.tr/rss/anasayfa.xml'
    ],
    magazine: [
      'https://www.milliyet.com.tr/rss/rssnew/magazinrss.xml',
      'https://www.hurriyet.com.tr/rss/magazin'
    ],
    economy: [
      'https://www.bloomberght.com/rss',
      'https://www.ekonomist.com.tr/rss',
      'https://www.dunya.com/rss'
    ],
    health: [
      'https://www.cnnturk.com/feed/rss/saglik/news',
      'https://www.ntv.com.tr/saglik.rss'
    ],
    culture: [
      'https://www.ntv.com.tr/sanat.rss'
    ],
  },
  en: {
    general: [
      'http://feeds.bbci.co.uk/news/rss.xml',
      'http://rss.cnn.com/rss/edition.rss',
      'https://www.aljazeera.com/xml/rss/all.xml'
    ],
    world: [
      'http://feeds.bbci.co.uk/news/world/rss.xml',
      'http://rss.cnn.com/rss/edition_world.rss'
    ],
    technology: [
      'http://feeds.bbci.co.uk/news/technology/rss.xml',
      'https://techcrunch.com/feed/',
      'https://www.theverge.com/rss/index.xml'
    ],
    sports: [
      'http://feeds.bbci.co.uk/sport/rss.xml',
      'https://www.espn.com/espn/rss/news'
    ],
    economy: [
      'http://feeds.bbci.co.uk/news/business/rss.xml',
      'https://www.cnbc.com/id/10000664/device/rss/rss.html'
    ],
    health: [
      'http://feeds.bbci.co.uk/news/health/rss.xml'
    ],
    culture: [
      'http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml'
    ],
  },
  ar: {
    general: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'], 
    world: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'],
    technology: ['https://www.aljazeera.net/aljazeerarss/c4e88383-a795-40b9-b5c4-7d5264b38343'],
    sports: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'],
    economy: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'],
    health: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'],
    culture: ['https://www.aljazeera.net/aljazeerarss/a7c186be-15e1-4bd4-96d2-335b56ca7d7e'],
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

  // -1. Check CUSTOM NEWS first
  if (isMatch(CUSTOM_NEWS_ITEM.id)) {
    return {
       ...CUSTOM_NEWS_ITEM,
       date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA'),
       time: new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' })
    };
  }

  // -0.5 Check Local Generated News (Master Editor)
  try {
    const localNews = await getLocalNews();
    const localFound = localNews.find(n => isMatch(n.id));
    if (localFound) return localFound;
  } catch (e) {
    console.error('Error fetching local news in getNewsById:', e);
  }

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
  const sourceUrls = RSS_SOURCES[lang]?.[sourceKey] || RSS_SOURCES[lang]?.['general'] || RSS_SOURCES['tr']['general'];
  const urls = Array.isArray(sourceUrls) ? sourceUrls : [sourceUrls];
  
  try {
    const feedPromises = urls.map(url => 
      fetchRss(url)
        .then(feed => ({ status: 'fulfilled', value: feed }))
        .catch(err => ({ status: 'rejected', reason: err }))
    );

    const results = await Promise.all(feedPromises);
    const successfulFeeds = results
      .filter((r): r is { status: 'fulfilled', value: any } => r.status === 'fulfilled')
      .map(r => r.value);

    let allItems: any[] = [];
    successfulFeeds.forEach(feed => {
      if (feed && feed.items) {
        allItems.push(...feed.items);
      }
    });

    // --- INTEGRATE LOCAL NEWS ---
    try {
      const localNews = await getLocalNews();
      const targetCategory = category.toLowerCase(); // 'general', 'economy', etc.
      
      const filteredLocalNews = localNews.filter(item => {
        const itemCat = item.category.toLowerCase(); // 'gündem', 'ekonomi', etc.
        
        // Map common Turkish categories to English keys used in fetchNews
        const isGeneral = (targetCategory === 'general' || targetCategory === 'gundem') && 
                          (itemCat === 'gündem' || itemCat === 'general');
        
        const isEconomy = (targetCategory === 'economy' || targetCategory === 'ekonomi') && 
                          (itemCat === 'ekonomi' || itemCat === 'economy');

        const isSports = (targetCategory === 'sports' || targetCategory === 'spor') && 
                         (itemCat === 'spor' || itemCat === 'sports');
                         
        const isTech = (targetCategory === 'technology' || targetCategory === 'teknoloji') && 
                       (itemCat === 'teknoloji' || itemCat === 'technology');
                       
        const isWorld = (targetCategory === 'world' || targetCategory === 'dunya') && 
                        (itemCat === 'dünya' || itemCat === 'dunya' || itemCat === 'world');

        const isMag = (targetCategory === 'magazine' || targetCategory === 'magazin') && 
                      (itemCat === 'magazin' || itemCat === 'magazine');

        return isGeneral || isEconomy || isSports || isTech || isWorld || isMag;
      });

      // Convert local news to RSS item format to be processed below
      // OR better: just add them to sortedItems directly later.
      // But to keep logic simple, let's map them to "items"
      const localItemsAsRSS = filteredLocalNews.map(n => {
        // Parse "DD.MM.YYYY" and "HH:MM"
        let dateObj = new Date();
        try {
          const [day, month, year] = n.date.split('.');
          const [hour, minute] = n.time.split(':');
          dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        } catch (e) {
           // fallback to now
        }

        return {
          guid: n.id,
          title: n.title,
          description: n.summary,
          'content:encoded': n.content,
          link: n.link,
          pubDate: dateObj.toISOString(),
          enclosure: { url: n.imageUrl },
          isLocal: true,
          rawDate: dateObj
        };
      });

      allItems.push(...localItemsAsRSS);

    } catch (e) {
      console.error('Error integrating local news:', e);
    }
    // ----------------------------

    // Deduplicate items based on link or id
    const uniqueItems = new Map();
    allItems.forEach(item => {
      const id = item.guid || item.link;
      if (!uniqueItems.has(id)) {
        uniqueItems.set(id, item);
      }
    });

    const sortedItems = Array.from(uniqueItems.values())
      .map((item, index) => {
        const id = item.guid || item.link || index.toString();
        const extractedImage = extractImage(item);
        const imageUrl = extractedImage || getFallbackImage(sourceKey, id, item.title);
        
        // Clean up description (remove HTML tags if necessary, but some components render HTML)
        // For this project, we'll strip HTML for the summary to be safe
        const summary = ((item as any).description || '').replace(/<[^>]+>/g, '').slice(0, 150) + '...';
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
          rawDate: pubDate, // For sorting
          isHeadline: false, // Will be set after sorting
          isBreaking: false, 
        };
      })
      .filter(item => item !== null) as (NewsItem & { rawDate: Date })[];

    // Sort by date descending
    sortedItems.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());

    // --- CUSTOM BREAKING NEWS INJECTION (SIMULATION) ---
    if (lang === 'tr' && category === 'general') {
      // Add to the TOP of the list
      sortedItems.unshift({
        ...CUSTOM_NEWS_ITEM,
        date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA'),
        time: new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' }),
        rawDate: new Date()
      });
    }
    // ---------------------------------------------------

    // Re-index headline/breaking status
    return sortedItems.map((item, index) => ({
      ...item,
      isHeadline: index < 5,
      isBreaking: index < 3
    }));

  } catch (error) {
    console.error(`Error fetching RSS for ${lang}/${category}:`, error);
    // FALLBACK: If RSS fails, return mock data for this category to avoid empty pages
    // Filter mockNews by category
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
    const mockFallback = mockNews.filter(n => n.category.toLowerCase() === category.toLowerCase());
    if (mockFallback.length > 0) {
       console.log(`Using mock fallback for ${category}`);
       
       // --- CUSTOM BREAKING NEWS INJECTION (FALLBACK SCENARIO) ---
       if (lang === 'tr' && category === 'general') {
         const customItem: NewsItem = {
           ...CUSTOM_NEWS_ITEM,
           date: new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA'),
           time: new Date().toLocaleTimeString(lang === 'tr' ? 'tr-TR' : lang === 'en' ? 'en-US' : 'ar-SA', { hour: '2-digit', minute: '2-digit' }),
           // rawDate not needed for return type
         };
         // @ts-ignore - rawDate is internal
         delete customItem.rawDate;
         
         mockFallback.unshift(customItem);
       }
       // -----------------------------------------------------------

       return mockFallback;
    }
    return [];
  }
}
