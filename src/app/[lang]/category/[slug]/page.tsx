import { categories } from '@/lib/data';
import { notFound } from 'next/navigation';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { fetchNews } from '@/lib/rss';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

interface PageProps {
  params: {
    lang: Locale;
    slug: string;
  };
}

// Statik sayfa üretimi için (SSG)
export function generateStaticParams() {
  // Since this is inside [lang], we need to combine langs with slugs?
  // Or just return slugs and let Next.js handle the cross-product if using generateStaticParams in layout too.
  // Actually, for [lang]/category/[slug], we need to return { lang: ..., slug: ... }
  // But usually we can omit if we want dynamic rendering on demand.
  // Let's stick to dynamic for simplicity or implement full cross product.
  // Given user wants "master level", let's leave it to dynamic to ensure fresh RSS data.
  return [];
}

export default async function CategoryPage({ params }: PageProps) {
  const { lang, slug } = params;
  const dict = await getDictionary(lang);
  
  // Slug'a göre kategoriyi bul
  const category = categories.find((c) => c.slug === slug);

  // If category is not in our static list, we might still want to try fetching RSS if mapped
  // But for now, let's respect the defined categories or allow if mapped in RSS
  
  if (!category) {
    // Optional: Allow generic slugs if they map to something
    // notFound();
  }

  const categoryName = category ? category.name : slug.charAt(0).toUpperCase() + slug.slice(1);
  const categoryColor = category ? category.color : '#3b82f6';

  // Fetch real news
  const categoryNews = await fetchNews(lang, slug);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Başlık Alanı */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <nav className="flex items-center text-sm text-gray-500 mb-2">
            <Link href={`/${lang}`} className="hover:text-primary">{dict.common.home}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
          <h1 className="text-3xl font-bold" style={{ color: categoryColor }}>
            {categoryName} {dict.common.news}
          </h1>
        </div>

        {/* Haber Listesi */}
        {categoryNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl text-gray-600">Bu kategoride henüz haber bulunmamaktadır.</h2>
            <Link href={`/${lang}`} className="text-primary hover:underline mt-4 inline-block">
              {dict.common.home}
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
