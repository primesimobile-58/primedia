"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '@/lib/data';

interface HeadlineSliderProps {
  news: NewsItem[];
  lang?: string;
}

export default function HeadlineSlider({ news, lang = 'tr' }: HeadlineSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);

  if (news.length === 0) return null;

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg bg-black aspect-[16/9] md:aspect-[21/9]">
      {/* Görsel */}
      <div className="absolute inset-0 transition-opacity duration-500">
        <Image
          src={news[currentIndex].imageUrl}
          alt={news[currentIndex].title}
          fill
          className="object-cover opacity-80 group-hover:opacity-90 transition-opacity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* İçerik */}
      <div className="absolute bottom-0 start-0 w-full p-6 md:p-10">
        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-white bg-primary rounded">
          {news[currentIndex].category}
        </span>
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight max-w-4xl">
          <Link href={`/${lang}/news/${encodeURIComponent(news[currentIndex].id)}`} className="hover:underline decoration-primary decoration-2 underline-offset-4">
            {news[currentIndex].title}
          </Link>
        </h2>
        <p className="text-gray-300 line-clamp-2 max-w-2xl text-sm md:text-base hidden md:block">
          {news[currentIndex].summary}
        </p>
      </div>

      {/* Kontroller */}
      <button 
        onClick={prevSlide}
        className="absolute start-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary backdrop-blur-sm rtl:rotate-180"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute end-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary backdrop-blur-sm rtl:rotate-180"
      >
        <ChevronRight size={24} />
      </button>

      {/* İndikatörler (Numaralı) */}
      <div className="absolute bottom-6 end-6 flex gap-2">
        {news.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all backdrop-blur-sm border ${
              currentIndex === idx 
                ? 'bg-primary border-primary text-white scale-110' 
                : 'bg-black/30 border-white/30 text-white hover:bg-white/20'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
