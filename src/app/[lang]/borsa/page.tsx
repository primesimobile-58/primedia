import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
import { fetchStockData, MarketData } from '@/lib/finance';
import TradingViewWidget from '@/components/TradingViewWidget';
import { TrendingUp, TrendingDown, Globe, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default async function BorsaPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang);
  const stockData = await fetchStockData();

  const bistIndices = stockData.filter(i => i.type === 'bist_index');
  const bistStocks = stockData.filter(i => i.type === 'bist_stock');
  const globalIndices = stockData.filter(i => i.type === 'global_index');
  const globalStocks = stockData.filter(i => i.type === 'global_stock');

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={32} className="text-secondary" />
            <h1 className="text-4xl md:text-5xl font-bold font-serif">{dict.nav.stock || 'Borsa'}</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl">{dict.common.currency || 'Piyasalar'} - BIST & Global</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        
        {/* TradingView Chart */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 h-[600px] border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 px-2">
            <span className="w-2 h-6 bg-secondary rounded-full"></span>
            {lang === 'tr' ? 'Canlı Grafik' : 'Live Chart'}
          </h2>
          <TradingViewWidget lang={lang} />
        </div>

        {/* BIST Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <BarChart3 size={24} />
            </div>
            Borsa İstanbul (BIST)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {bistIndices.map((item) => (
              <StockCard key={item.symbol} item={item} lang={lang} />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">
              {lang === 'tr' ? 'Popüler Hisseler' : 'Popular Stocks'}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3">{lang === 'tr' ? 'Sembol' : 'Symbol'}</th>
                    <th className="px-6 py-3">{lang === 'tr' ? 'İsim' : 'Name'}</th>
                    <th className="px-6 py-3 text-right">{lang === 'tr' ? 'Fiyat' : 'Price'}</th>
                    <th className="px-6 py-3 text-right">{lang === 'tr' ? 'Değişim' : 'Change'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bistStocks.map((item) => (
                    <StockRow key={item.symbol} item={item} lang={lang} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Markets Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Globe size={24} />
            </div>
            {lang === 'tr' ? 'Dünya Borsaları' : 'Global Markets'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {globalIndices.map((item) => (
              <StockCard key={item.symbol} item={item} lang={lang} variant="blue" />
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-gray-700">
              {lang === 'tr' ? 'Global Hisseler' : 'Global Stocks'}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-6 py-3">{lang === 'tr' ? 'Sembol' : 'Symbol'}</th>
                    <th className="px-6 py-3">{lang === 'tr' ? 'İsim' : 'Name'}</th>
                    <th className="px-6 py-3 text-right">{lang === 'tr' ? 'Fiyat' : 'Price'}</th>
                    <th className="px-6 py-3 text-right">{lang === 'tr' ? 'Değişim' : 'Change'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {globalStocks.map((item) => (
                    <StockRow key={item.symbol} item={item} lang={lang} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

function StockCard({ item, lang, variant = 'red' }: { item: MarketData, lang: string, variant?: 'red' | 'blue' }) {
  const isUp = item.change >= 0;
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';
  const borderColor = variant === 'red' ? 'border-red-500' : 'border-blue-500';
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <span className="font-bold text-gray-900 text-lg">{item.name}</span>
        {isUp ? <TrendingUp size={20} className="text-green-500" /> : <TrendingDown size={20} className="text-red-500" />}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(item.price)}
        </span>
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isUp ? '+' : ''}%{Math.abs(item.changePercent).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function StockRow({ item, lang }: { item: MarketData, lang: string }) {
  const isUp = item.change >= 0;
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';
  
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-900">{item.symbol.replace('.IS', '')}</td>
      <td className="px-6 py-4 text-gray-600">{item.name}</td>
      <td className="px-6 py-4 text-right font-bold text-gray-900">
        {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className={`flex items-center justify-end gap-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
          {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="font-medium">%{Math.abs(item.changePercent).toFixed(2)}</span>
        </div>
      </td>
    </tr>
  );
}