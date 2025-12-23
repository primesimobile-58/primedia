import Image from 'next/image';
import { Play, Clock, Eye } from 'lucide-react';
import { mockVideos } from '@/lib/data';

interface VideoGalleryProps {
  dict: any;
}

export default function VideoGallery({ dict }: VideoGalleryProps) {
  return (
    <section className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-red-600 rounded-sm"></span>
            {dict.home?.todays_videos || 'Video Haberler'}
          </h2>
          <button className="text-gray-400 hover:text-white text-sm transition-colors">
            {dict.common?.all_news || 'Tüm Videoları Gör'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockVideos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-800">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">
                  {video.category}
                </span>
                <h3 className="text-lg font-medium leading-tight group-hover:text-red-500 transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Eye size={12} />
                    {video.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
