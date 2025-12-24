'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone, Download } from 'lucide-react';

export default function AppBanner({ lang }: { lang: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const content = {
    tr: {
      title: 'Primedia Mobil Uygulaması',
      desc: 'Daha hızlı haber deneyimi ve anlık bildirimler için uygulamamızı indirin.',
      button: 'Uygulamayı İndir',
    },
    en: {
      title: 'Primedia Mobile App',
      desc: 'Download our app for faster news experience and instant notifications.',
      button: 'Download App',
    },
    ar: {
      title: 'تطبيق Primedia للهاتف المحمول',
      desc: 'قم بتنزيل تطبيقنا للحصول على تجربة أخبار أسرع وإشعارات فورية.',
      button: 'تنزيل التطبيق',
    }
  };

  const t = content[lang as keyof typeof content] || content.tr;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom duration-500 lg:hidden">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
            <span className="text-xl font-bold">P</span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">{t.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{t.desc}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-dark transition-colors whitespace-nowrap">
            <Download size={16} />
            <span className="hidden sm:inline">{t.button}</span>
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
