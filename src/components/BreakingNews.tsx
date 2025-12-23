import { Bell } from 'lucide-react';
import Link from 'next/link';

interface BreakingNewsProps {
  news: string[];
  dict: any;
}

export default function BreakingNews({ news, dict }: BreakingNewsProps) {
  return (
    <div className="bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-2 animate-pulse shrink-0">
          <Bell size={12} />
          {dict.common.breaking_news}
        </div>
        <div className="flex-1 overflow-hidden ms-4 relative h-6">
          <div className="animate-marquee whitespace-nowrap absolute top-0 start-0 flex items-center h-full text-sm font-medium text-gray-800">
            {news.map((item, index) => (
              <span key={index} className="mx-8 flex items-center">
                <span className="w-1.5 h-1.5 bg-accent rounded-full me-3"></span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
