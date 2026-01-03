import { MetadataRoute } from 'next';
import { getNews } from '@/lib/news-service';
import type { NewsItem } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://primedia.com'; // In production this should be env var
  
  // Get dynamic news
  const news: NewsItem[] = await getNews();
  
  // Static routes
  const staticRoutes = [
    '',
    '/tr',
    '/en',
    '/ar',
    '/tr/finance',
    '/tr/borsa',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/tr' ? 1 : 0.8,
  }));

  // Categories
  const categories = ['gundem', 'dunya', 'ekonomi', 'spor', 'teknoloji', 'magazin', 'otomobil', 'saglik', 'kultur-sanat'];
  const categoryRoutes = categories.map(cat => ({
    url: `${baseUrl}/tr/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }));

  // Dynamic News Routes
  const newsRoutes = news.map((item: NewsItem) => {
    let date = new Date();
    try {
      if (item.date) {
        date = new Date(item.date.split('.').reverse().join('-'));
      }
    } catch (e) {
      console.error('Date parsing error for sitemap:', e);
    }

    return {
      url: `${baseUrl}${item.link || `/news/${item.id}`}`,
      lastModified: date,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...newsRoutes];
}
