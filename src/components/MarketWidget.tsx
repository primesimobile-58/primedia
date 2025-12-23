import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketData } from '@/lib/finance';

interface MarketWidgetProps {
  dict?: any;
  data?: MarketData[];
  lang?: string;
}

export default function MarketWidget({ dict, data = [], lang = 'tr' }: MarketWidgetProps) {
  return (
    <div className="bg-primary text-white py-2 text-xs border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <div className="font-bold text-secondary flex items-center gap-2">
            <TrendingUp size={16} />
            <span>{dict?.common?.currency || 'PİYASALAR'}</span>
          </div>
          {data.map((item, index) => {
            const isUp = item.change >= 0;
            const isDown = item.change < 0;
            const locale = lang === 'ar' ? 'ar-SA' : lang === 'en' ? 'en-US' : 'tr-TR';
            const formatPrice = (price: number) => {
              return new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price);
            };
            
            return (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium text-gray-400">{item.name}</span>
                <span className="font-bold">{formatPrice(item.price)}</span>
                <span className={`flex items-center ${
                  isUp ? 'text-green-500' : 
                  isDown ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {isUp ? <TrendingUp size={12} className="me-1" /> : 
                   isDown ? <TrendingDown size={12} className="me-1" /> : 
                   <Minus size={12} className="me-1" />}
                  %{Math.abs(item.changePercent).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
