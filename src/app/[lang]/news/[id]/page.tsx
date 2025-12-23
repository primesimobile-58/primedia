import { mockNews } from '@/lib/data';
import { Calendar, Clock, Eye, Share2, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Locale } from '@/i18n-config';
import NewsCard from '@/components/NewsCard';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/get-dictionary';
import { getNewsById } from '@/lib/rss';

interface PageProps {
  params: {
    id: string;
    lang: Locale;
  };
}

// Statik sayfa üretimi için gerekli (SSG)
export function generateStaticParams() {
  // Since we are inside [lang], we strictly need to return { lang, id }
  // But mockNews is global. We should probably generate for all langs x mockNews
  // For simplicity in this demo, let's just return IDs and let Next.js handle lang via layout
  // Actually, generateStaticParams in a dynamic segment must return all params for that segment down.
  // But if we only return id, it might fail for lang.
  // Let's rely on dynamicParams = true (default) and empty array or minimal set.
  return [];
}

export default async function NewsDetail({ params }: PageProps) {
  const { id, lang } = params;
  const dict = await getDictionary(lang);
  
  // Fetch news from RSS or mock data
  const news = await getNewsById(id, lang);

  if (!news) {
    notFound();
  }

  // Benzer Haberler (Aynı kategoriden, kendisi hariç)
  // For related news, we can filter mockNews or just show some random ones if we can't fetch more
  // Since we don't have easy access to "all news" here without re-fetching, 
  // we will use mockNews for "Related" to ensure fast render, or we could fetch category again.
  // Let's stick to mockNews for related for now to avoid double fetch latency, 
  // OR better: since we don't have the category feed handy, just show mockNews as "Suggested".
  const relatedNews = mockNews
    .filter((n) => n.id !== news.id) // Just exclude current
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sol Kolon: Haber İçeriği (8 birim) */}
          <article className="lg:col-span-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
            {/* Ekmek Kırıntısı (Breadcrumb) */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
              <Link href={`/${lang}`} className="hover:text-primary">Anasayfa</Link>
              <span className="mx-2">/</span>
              <Link href={`/${lang}/category/${news.category.toLowerCase()}`} className="hover:text-primary">{news.category}</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{news.title}</span>
            </nav>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{news.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{news.time}</span>
              </div>
              {news.viewCount && (
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{news.viewCount.toLocaleString()} görüntülenme</span>
                </div>
              )}
            </div>

            {/* Manşet Görseli */}
            <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={news.imageUrl}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Özet */}
            <p className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">
              {news.summary}
            </p>

            {/* İçerik (Simülasyon) */}
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <h3>Gelişmeler Yakından Takip Ediliyor</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
              <blockquote>
                "Bu olay, sektörde dönüm noktası olarak kabul ediliyor. Gelecek günler çok daha hareketli geçecek."
              </blockquote>
              <p>
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
              </p>
            </div>

            {/* Paylaşım Butonları */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 size={20} />
                Haberi Paylaş
              </h4>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded hover:opacity-90 transition-opacity">
                  <Facebook size={18} /> Facebook
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded hover:opacity-90 transition-opacity">
                  <Twitter size={18} /> Twitter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  <LinkIcon size={18} /> Bağlantıyı Kopyala
                </button>
              </div>
            </div>
          </article>

          {/* Sağ Kolon: Kenar Çubuğu (4 birim) */}
          <aside className="lg:col-span-4 space-y-8">
             {/* Reklam Alanı */}
            <div className="bg-gray-100 rounded-lg h-[300px] flex items-center justify-center text-gray-400 border border-dashed border-gray-300 sticky top-24">
              Reklam Alanı (300x600)
            </div>

            {/* Benzer Haberler */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-primary pl-3">
                İlginizi Çekebilir
              </h3>
              <div className="space-y-6">
                {relatedNews.length > 0 ? (
                  relatedNews.map(item => (
                    <NewsCard key={item.id} news={item} />
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Bu kategoride başka haber bulunamadı.</p>
                )}
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer lang={lang} dict={dict} />
    </div>
  );
}
