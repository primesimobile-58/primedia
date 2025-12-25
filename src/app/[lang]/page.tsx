import NewsCard from '@/components/NewsCard';
import BreakingNews from '@/components/BreakingNews';
import HeadlineSlider from '@/components/HeadlineSlider';
import FinanceModule from '@/components/FinanceModule';
import AuthorsSection from '@/components/AuthorsSection';
import VideoGallery from '@/components/VideoGallery';
import { mockNews, CUSTOM_NEWS_ITEM } from '@/lib/data';
import Link from 'next/link';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
import { fetchNews } from '@/lib/rss';
import { fetchMarketData } from '@/lib/finance';
import Advertisement from '@/components/Advertisement';

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function Home({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);

  // Parallel data fetching from RSS sources and Market Data
  const [generalNews, techNewsData, sportNewsData, magazineNewsData, economyNewsData, marketData] = await Promise.all([
    fetchNews(lang, 'general'),
    fetchNews(lang, 'technology'),
    fetchNews(lang, 'sports'),
    fetchNews(lang, 'magazine'),
    fetchNews(lang, 'economy'),
    fetchMarketData(),
  ]);

  // Fallback to mock data if RSS fails or is empty (for robustness)
  let safeGeneral = generalNews.length > 0 ? generalNews : mockNews;
  
  // SIMULATION: Force Inject Custom News Item for TR
  if (lang === 'tr') {
    const customItem = {
      ...CUSTOM_NEWS_ITEM,
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };
    
    // Remove if exists then unshift to top
    safeGeneral = [customItem, ...safeGeneral.filter(n => n.id !== CUSTOM_NEWS_ITEM.id)];
  }

  const safeTech = techNewsData.length > 0 ? techNewsData : mockNews.filter(n => n.category === 'Teknoloji');
  const safeSport = sportNewsData.length > 0 ? sportNewsData : mockNews.filter(n => n.category === 'Spor');
  const safeMagazine = magazineNewsData.length > 0 ? magazineNewsData : mockNews.filter(n => n.category === 'Magazin');

  const headlineNews = safeGeneral.slice(0, 10); // First 10 general news for slider
  const breakingNewsTitles = safeGeneral.slice(0, 5).map(n => n.title);
  
  // Side news (beside slider) - items 10-12 from general
  const sideNews = safeGeneral.length > 13 ? safeGeneral.slice(10, 12) : safeGeneral.slice(0, 2);

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* Breaking News Band */}
      <BreakingNews news={breakingNewsTitles} dict={dict} />
      
      {/* Ana Manşet Alanı */}
      <section className="py-6 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol: Slider (8 birim) */}
          <div className="lg:col-span-8">
            <HeadlineSlider news={headlineNews} />
          </div>
          
          {/* Sağ: Yan Haberler ve Finans (4 birim) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Finans Modülü (En Üstte) */}
            <div className="h-[380px]">
              <FinanceModule data={marketData} dict={dict} lang={lang} />
            </div>

            {/* Sidebar Ad - Rectangle */}
            <div className="flex justify-center my-2">
              <Advertisement format="rectangle" slot="home-sidebar" />
            </div>

            {/* Yan Haberler */}
            {sideNews.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`} className="group flex gap-4 bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                 <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden">
                   <img src={news.imageUrl} alt={news.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                 </div>
                 <div className="flex flex-col justify-center">
                   <span className="text-xs font-bold text-primary mb-1">{news.category}</span>
                   <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                     {news.title}
                   </h3>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Teknoloji & Otomobil Bloğu */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center gap-2">
              <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
              {dict.home.tech_future}
            </h2>
            <Link href={`/${lang}/category/teknoloji`} className="text-indigo-600 font-medium text-sm flex items-center hover:underline">
              {dict.common.all_news} <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safeTech.slice(0, 4).map(news => (
              <NewsCard key={news.id} news={news} readMoreText={dict.common.read_more} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* Spor & Magazin (Çift Kolon) */}
      <section className="py-8 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Spor */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-bold font-serif text-gray-900 text-amber-600">{dict.home.sports_agenda}</h2>
              <Link href={`/${lang}/category/spor`} className="text-gray-500 text-xs hover:text-amber-600">{dict.common.all_news}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeSport.slice(0, 4).map(news => (
                <NewsCard key={news.id} news={news} readMoreText={dict.common.read_more} />
              ))}
            </div>
          </div>

          {/* Magazin */}
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
              <h2 className="text-xl font-bold font-serif text-gray-900 text-pink-600">{dict.home.magazine_life}</h2>
              <Link href={`/${lang}/category/magazin`} className="text-gray-500 text-xs hover:text-pink-600">{dict.common.all_news}</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeMagazine.slice(0, 4).map(news => (
                <NewsCard key={news.id} news={news} readMoreText={dict.common.read_more} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Köşe Yazarları */}
      <AuthorsSection lang={lang} dict={dict} />

      {/* Video Galeri */}
      <VideoGallery dict={dict} />
    </main>
  );
}