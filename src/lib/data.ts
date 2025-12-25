import { Newspaper, TrendingUp, Activity, Globe, Smartphone, Film, Car, Heart, Monitor } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Gündem', slug: 'gundem', color: '#ef4444' }, // red-500
  { id: '2', name: 'Dünya', slug: 'dunya', color: '#3b82f6' }, // blue-500
  { id: '3', name: 'Ekonomi', slug: 'ekonomi', color: '#22c55e' }, // green-500
  { id: '4', name: 'Spor', slug: 'spor', color: '#f59e0b' }, // amber-500
  { id: '5', name: 'Teknoloji', slug: 'teknoloji', color: '#6366f1' }, // indigo-500
  { id: '6', name: 'Magazin', slug: 'magazin', color: '#ec4899' }, // pink-500
  { id: '7', name: 'Otomobil', slug: 'otomobil', color: '#ef4444' }, // red-500
  { id: '8', name: 'Sağlık', slug: 'saglik', color: '#06b6d4' }, // cyan-500
  { id: '9', name: 'Kültür Sanat', slug: 'kultur-sanat', color: '#8b5cf6' }, // violet-500
];

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  imageUrl: string;
  date: string;
  time: string;
  viewCount?: number;
  isHeadline?: boolean;
  isBreaking?: boolean;
  content?: string; // HTML content from RSS
  link?: string;    // Original link
}

import mockNewsData from '@/data/news.json';

export const CUSTOM_NEWS_ITEM: NewsItem & { rawDate?: Date } = mockNewsData[0] as NewsItem;

export const mockNews: NewsItem[] = mockNewsData as NewsItem[];

export const marketData = [
  { pair: 'USD/TRY', value: '28.14', change: '+0.12%', dir: 'up' },
  { pair: 'EUR/TRY', value: '29.85', change: '-0.05%', dir: 'down' },
  { pair: 'GA.ALTIN', value: '1785', change: '+1.20%', dir: 'up' },
  { pair: 'BIST 100', value: '7850', change: '+2.45%', dir: 'up' },
  { pair: 'BTC/USD', value: '34500', change: '+5.10%', dir: 'up' },
];

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
}

export const mockVideos: VideoItem[] = [
  {
    id: 'v1',
    title: 'Yeni Nesil Elektrikli Otomobil Test Sürüşü',
    category: 'Otomobil',
    thumbnailUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop',
    duration: '12:45',
    views: '1.2M'
  },
  {
    id: 'v2',
    title: 'Dev Derbi Öncesi Son Gelişmeler',
    category: 'Spor',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
    duration: '08:30',
    views: '540K'
  },
  {
    id: 'v3',
    title: 'Yapay Zeka Dünyayı Nasıl Değiştirecek?',
    category: 'Teknoloji',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    duration: '15:20',
    views: '2.1M'
  },
  {
    id: 'v4',
    title: 'Sağlıklı Yaşam İçin Sabah Rutini',
    category: 'Sağlık',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1000&auto=format&fit=crop',
    duration: '06:15',
    views: '890K'
  }
];

export interface Author {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  lastArticle: {
    title: string;
    date: string;
  };
}

export const mockAuthors: Author[] = [
  {
    id: 'a1',
    name: 'Ahmet Yılmaz',
    title: 'Ekonomi Yazarı',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    lastArticle: {
      title: 'Merkez Bankası\'nın Faiz Kararı Ne Anlama Geliyor?',
      date: '2023-10-26'
    }
  },
  {
    id: 'a2',
    name: 'Ayşe Demir',
    title: 'Teknoloji Editörü',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    lastArticle: {
      title: 'Yapay Zeka Çağında İnsan Olmak',
      date: '2023-10-25'
    }
  },
  {
    id: 'a3',
    name: 'Mehmet Öz',
    title: 'Spor Yorumcusu',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    lastArticle: {
      title: 'Derbinin Taktik Analizi: Kim Kazanır?',
      date: '2023-10-24'
    }
  },
  {
    id: 'a4',
    name: 'Zeynep Kaya',
    title: 'Kültür Sanat',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    lastArticle: {
      title: 'Modern Sanatın Geleceği ve Dijitalleşme',
      date: '2023-10-23'
    }
  }
];
