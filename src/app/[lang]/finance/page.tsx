import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
import { fetchMarketData, MarketData } from '@/lib/finance';
import { fetchNews } from '@/lib/rss';
import NewsCard from '@/components/NewsCard';
import TradingViewWidget from '@/components/TradingViewWidget';
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Briefcase } from 'lucide-react';

export default async function FinancePage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const marketData = await fetchMarketData();
  const economyNews = await fetchNews(lang, 'economy');

  const safeNews = economyNews.length > 0 ? economyNews : [];

  // Group market data
  const currencies = marketData.filter(i => i.type === 'currency');
  const stocks = marketData.filter(i => i.type === 'stock');
  const commodities = marketData.filter(i => i.type === 'commodity');
  const cryptos = marketData.filter(i => i.type === 'crypto');

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">{dict.nav.finance}</h1>
          <p className="text-white/80 text-lg max-w-2xl">{dict.common.currency} - {dict.nav.economy}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
           {marketData.slice(0, 4).map((item) => (
             <MarketCard key={item.symbol} item={item} lang={lang} />
           ))}
        </div>

        {/* TradingView Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 h-[550px]">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-secondary rounded-full"></span>
            Canlı Grafik Analizi
          </h2>
          <TradingViewWidget lang={lang} />
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Market Details */}
          <div className="lg:col-span-2 space-y-8">
            <Section title="Borsa & Endeksler" items={stocks} lang={lang} />
            <Section title="Döviz Kurları" items={currencies} lang={lang} />
            <Section title="Emtia" items={commodities} lang={lang} />
            <Section title="Kripto Paralar" items={cryptos} lang={lang} />
          </div>

          {/* Right Column: Economy News */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-serif text-gray-900 border-b pb-2">{dict.nav.economy} {dict.common.breaking_news}</h2>
            <div className="flex flex-col gap-4">
              {safeNews.slice(0, 10).map(news => (
                 <NewsCard key={news.id} news={news} readMoreText={dict.common.read_more} lang={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function MarketCard({ item, lang }: { item: MarketData, lang: string }) {
  const isUp = item.change >= 0;
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-700">{item.name}</h3>
        {item.type === 'currency' ? <DollarSign className="text-gray-400" size={20} /> : 
         item.type === 'crypto' ? <Bitcoin className="text-gray-400" size={20} /> :
         <Briefcase className="text-gray-400" size={20} />}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">
        {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(item.price)}
      </div>
      <div className={`flex items-center text-sm font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
        <span>{isUp ? '+' : ''}%{Math.abs(item.changePercent).toFixed(2)}</span>
      </div>
    </div>
  );
}

function Section({ title, items, lang }: { title: string, items: MarketData[], lang: string }) {
  if (items.length === 0) return null;
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-secondary rounded-full"></span>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Sembol</th>
              <th className="px-4 py-3">Son</th>
              <th className="px-4 py-3">Değişim</th>
              <th className="px-4 py-3">Yüzde</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
               const isUp = item.change >= 0;
               return (
                <tr key={item.symbol} className="border-b hover:bg-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 font-bold">{new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(item.price)}</td>
                  <td className={`px-4 py-3 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(item.change)}
                  </td>
                  <td className={`px-4 py-3 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                     <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${isUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isUp ? '+' : ''}%{Math.abs(item.changePercent).toFixed(2)}
                     </span>
                  </td>
                </tr>
               );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}