'use client';

import Link from 'next/link';
import { Menu, Search, User, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  lang: string;
  dict: any;
}

export default function Navbar({ lang, dict }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { key: 'agenda', path: 'category/gundem' },
    { key: 'world', path: 'category/dunya' },
    { key: 'economy', path: 'category/ekonomi' },
    { key: 'finance', path: 'finance' },
    { key: 'stock', path: 'borsa' },
    { key: 'sports', path: 'category/spor' },
    { key: 'technology', path: 'category/teknoloji' },
    { key: 'magazine', path: 'category/magazin' },
    { key: 'health', path: 'category/saglik' },
    { key: 'culture', path: 'category/kultur-sanat' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary text-white flex items-center justify-center font-bold text-2xl rounded-lg shadow-primary/30 shadow-lg group-hover:scale-105 transition-transform duration-300">P</div>
            <span className="text-2xl font-bold tracking-tighter text-gray-900 group-hover:text-primary transition-colors">PRIMEDIA</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
            {categories.map((cat) => (
              <Link 
                key={cat.key} 
                href={`/${lang}/${cat.path}`} 
                className="hover:text-secondary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-secondary after:transition-all hover:after:w-full"
              >
                {dict.nav[cat.key]}
              </Link>
            ))}
          </div>

          {/* Icons & Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher lang={lang} />
            
            <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
              <Search size={20} />
            </button>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg">
              <User size={18} />
              <span>{dict.common.login}</span>
            </button>
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link 
                  key={cat.key} 
                  href={`/${lang}/${cat.path}`}
                  className="px-4 py-3 hover:bg-gray-50 rounded-lg text-gray-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {dict.nav[cat.key]}
                </Link>
              ))}
              <hr className="my-2 border-gray-100" />
              <button className="flex items-center gap-2 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 w-full text-start">
                <User size={20} />
                <span>{dict.common.login}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
