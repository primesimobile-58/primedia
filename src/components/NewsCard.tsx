import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { NewsItem } from '@/lib/data';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
  readMoreText?: string;
}

export default function NewsCard({ news, featured = false, readMoreText = 'Devamını Oku' }: NewsCardProps) {
  return (
    <Link href={`/news/${news.id}`} className="group block h-full">
      <div className={`relative overflow-hidden rounded-lg shadow-sm border border-gray-100 bg-white h-full flex flex-col ${featured ? 'md:flex-row md:items-stretch' : ''}`}>
        
        {/* Resim Alanı */}
        <div className={`relative overflow-hidden ${featured ? 'md:w-2/3 h-64 md:h-auto' : 'h-48 w-full'}`}>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 start-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-md">
            {news.category}
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className={`p-4 flex flex-col justify-between ${featured ? 'md:w-1/3 md:p-6' : 'flex-1'}`}>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{news.date}</span>
            </div>
            <h3 className={`font-bold text-gray-900 group-hover:text-primary transition-colors ${featured ? 'text-2xl mb-3' : 'text-lg mb-2 line-clamp-2'}`}>
              {news.title}
            </h3>
            <p className={`text-gray-600 ${featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>
              {news.summary}
            </p>
          </div>
          
          <div className="mt-4 flex items-center text-primary text-sm font-medium gap-1">
            {readMoreText} <ArrowRight size={16} className="rtl:rotate-180" />
          </div>
        </div>
      </div>
    </Link>
  );
}
