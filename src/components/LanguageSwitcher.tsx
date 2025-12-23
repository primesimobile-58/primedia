'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n } from '@/i18n-config';
import { Globe } from 'lucide-react';
import { useState } from 'react';

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const localeNames = {
    tr: 'Türkçe',
    en: 'English',
    ar: 'العربية'
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors text-sm font-medium"
      >
        <Globe size={18} />
        <span className="uppercase">{lang}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-100 z-50">
          {i18n.locales.map((locale) => (
            <Link
              key={locale}
              href={redirectedPathName(locale)}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-sm hover:bg-gray-50 ${
                lang === locale ? 'text-primary font-bold' : 'text-gray-700'
              }`}
            >
              {localeNames[locale]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
