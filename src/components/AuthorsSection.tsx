import Image from 'next/image';
import Link from 'next/link';
import { mockAuthors } from '@/lib/data';
import { PenTool } from 'lucide-react';

interface AuthorsSectionProps {
  lang: string;
  dict: any;
}

export default function AuthorsSection({ lang, dict }: AuthorsSectionProps) {
  return (
    <section className="py-12 bg-white border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-secondary rounded-sm"></span>
            {dict.home?.authors || 'Köşe Yazarları'}
          </h2>
          <Link href={`/${lang}/authors`} className="text-gray-500 hover:text-primary text-sm transition-colors flex items-center gap-1">
            {dict.home?.all_authors || 'Tüm Yazarlar'}
            <PenTool size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockAuthors.map((author) => (
            <div key={author.id} className="group cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0 group-hover:border-secondary transition-colors">
                  <Image
                    src={author.imageUrl}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {author.name}
                  </h3>
                  <span className="text-xs text-secondary font-medium uppercase tracking-wide">
                    {author.title}
                  </span>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-snug group-hover:text-gray-900">
                    {author.lastArticle.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
