'use client';

import { useState } from 'react';
import { Minus, Plus, Link as LinkIcon } from 'lucide-react';

interface NewsContentProps {
  content?: string;
  summary: string;
  link?: string;
}

export default function NewsContent({ content, summary, link }: NewsContentProps) {
  const [fontSize, setFontSize] = useState(1); // 0: Small, 1: Normal, 2: Large

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 0: return 'prose-sm';
      case 1: return 'prose-lg';
      case 2: return 'prose-xl';
      default: return 'prose-lg';
    }
  };

  return (
    <div>
      {/* Reading Controls */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <span className="text-sm text-gray-500 font-medium">Yazı Boyutu</span>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setFontSize(Math.max(0, fontSize - 1))}
            disabled={fontSize === 0}
            className="p-1.5 hover:bg-white rounded text-gray-600 disabled:opacity-50 transition-colors"
            aria-label="Küçült"
          >
            <Minus size={16} />
          </button>
          <span className="text-xs font-bold w-4 text-center">{fontSize + 1}</span>
          <button 
            onClick={() => setFontSize(Math.min(2, fontSize + 1))}
            disabled={fontSize === 2}
            className="p-1.5 hover:bg-white rounded text-gray-600 disabled:opacity-50 transition-colors"
            aria-label="Büyüt"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={`prose max-w-none text-gray-800 transition-all duration-300 ${getFontSizeClass()}`}>
        {content ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="lead">{summary}</p>
        )}
        
        {/* Source Link */}
        {link && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center not-prose">
            <p className="text-gray-600 mb-4">Bu haberin detayı ve tüm görselleri için kaynağı ziyaret edebilirsiniz.</p>
            <a 
              href={link} 
              target="_blank" 
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
            >
              Haberin Devamını Oku <LinkIcon size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
