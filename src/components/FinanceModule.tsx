'use client';

import { useState } from 'react';
import { MarketData } from '@/lib/finance';
import { TrendingUp, TrendingDown, ChevronRight, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Link from 'next/link';

interface FinanceModuleProps {
  data: MarketData[];
  dict: any;
  lang: string;
}

type TabType = 'all' | 'currency' | 'gold' | 'stock' | 'crypto';

export default function FinanceModule({ data, dict, lang }: FinanceModuleProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Categorize data
  const currencies = data.filter(item => item.type === 'currency');
  const stocks = data.filter(item => item.type === 'stock');
  const commodities = data.filter(item => item.type === 'commodity');
  const cryptos = data.filter(item => item.type === 'crypto');

  // Filter based on active tab
  const getDisplayData = () => {
    switch (activeTab) {
      case 'currency': return currencies;
      case 'gold': return commodities;
      case 'stock': return stocks;
      case 'crypto': return cryptos;
      default: return data.slice(0, 8); // Show mix in 'all'
    }
  };

  const displayData = getDisplayData();
  const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="text-green-400" size={20} />
          {dict.nav.finance || 'Piyasalar'}
        </h3>
        <Link href={`/${lang}/finance`} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
          {dict.common.all_news} <ChevronRight size={14} className="rtl:rotate-180" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar">
        <TabButton label="Tümü" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
        <TabButton label="Borsa" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
        <TabButton label="Döviz" active={activeTab === 'currency'} onClick={() => setActiveTab('currency')} />
        <TabButton label="Altın" active={activeTab === 'gold'} onClick={() => setActiveTab('gold')} />
        <TabButton label="Kripto" active={activeTab === 'crypto'} onClick={() => setActiveTab('crypto')} />
      </div>

      {/* List */}
      <div className="divide-y divide-gray-50">
        {displayData.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div key={item.symbol} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between group">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors">{item.name}</span>
                <span className="text-xs text-gray-500">{item.symbol}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-900 text-sm">
                  {new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price)}
                </span>
                <span className={`text-xs font-medium flex items-center ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                  {isUp ? <ArrowUpRight size={12} className="me-1" /> : <ArrowDownRight size={12} className="me-1" />}
                  %{Math.abs(item.changePercent).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer Link */}
      <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
        <Link href={`/${lang}/finance`} className="text-xs font-medium text-primary hover:text-primary-dark transition-colors">
          Detaylı Finans Ekranı &rarr;
        </Link>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors relative
        ${active ? 'text-primary' : 'text-gray-500 hover:text-gray-800'}
      `}
    >
      {label}
      {active && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
    </button>
  );
}