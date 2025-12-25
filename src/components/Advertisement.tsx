import React from 'react';
import { siteConfig } from '@/site-config';

type AdFormat = 'leaderboard' | 'rectangle' | 'vertical' | 'in-article';

interface AdvertisementProps {
  format: AdFormat;
  className?: string;
  slot?: keyof typeof siteConfig.ads; // Restrict to valid keys
  label?: string;
}

const AdDimensions = {
  leaderboard: { width: 728, height: 90, mobileHeight: 50 },
  rectangle: { width: 300, height: 250 },
  vertical: { width: 300, height: 600 },
  'in-article': { width: '100%', height: 'auto', minHeight: 250 },
};

export default function Advertisement({ format, className = '', slot, label = 'REKLAM ALANI' }: AdvertisementProps) {
  // Global reklam kontrolü
  if (!siteConfig.features.enableAds) return null;

  const dimensions = AdDimensions[format];
  const width = dimensions.width;
  const height = dimensions.height;
  // @ts-ignore
  const minHeight = dimensions.minHeight;

  // Config'den gerçek Slot ID'yi al
  const adUnitId = slot ? siteConfig.ads[slot] : undefined;

  // Eğer gerçek reklam ID'si varsa, burada o reklamı render edebiliriz.
  // Şimdilik sadece ID'yi gösteriyoruz veya placeholder dönüyoruz.

  return (
    <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
      <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 select-none">
        {label}
      </span>
      <div 
        className={`
          bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-sm
          overflow-hidden relative
        `}
        style={{
          width: format === 'in-article' ? '100%' : 'auto',
          minWidth: format === 'in-article' ? '100%' : width,
          height: format === 'in-article' ? (minHeight || 250) : height,
          maxWidth: '100%'
        }}
      >
        {/* Placeholder Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
        </div>
        
        <div className="flex flex-col items-center gap-2 z-10 p-4 text-center">
          <span className="font-semibold text-gray-500">{dimensions.width === '100%' ? 'Responsive' : `${dimensions.width}x${dimensions.height}`}</span>
          {slot && <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">Slot Key: {slot}</span>}
          {adUnitId && <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">Active ID: {adUnitId}</span>}
          <span className="text-xs">Reklam Alanı</span>
        </div>
      </div>
    </div>
  );
}
