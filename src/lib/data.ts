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
  category: string;
  imageUrl: string;
  summary: string;
  content?: string; // Detay sayfası için
  date: string;
  time: string;
  isHeadline?: boolean;
  isBreaking?: boolean;
  viewCount?: number;
}

export const mockNews: NewsItem[] = [
  // Manşetler
  {
    id: '101',
    title: 'Yerli Teknoloji Devinden Tarihi Başarı: Global Pazarda Liderliğe Yükseldi',
    category: 'Teknoloji',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop',
    summary: 'Türkiye\'nin önde gelen teknoloji firması, geliştirdiği yapay zeka çipi ile dünya devlerini geride bıraktı. Hisseler tavan yaptı.',
    date: '2023-10-26',
    time: '14:30',
    isHeadline: true,
    viewCount: 15420
  },
  {
    id: '102',
    title: 'Merkez Bankası Kritik Kararı Açıkladı: Piyasalarda Son Durum',
    category: 'Ekonomi',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop',
    summary: 'Merkez Bankası faiz kararını duyurdu. Dolar ve Euro kurunda sert hareketlilik yaşanıyor. İşte uzman yorumları...',
    date: '2023-10-26',
    time: '14:00',
    isHeadline: true,
    isBreaking: true,
    viewCount: 28900
  },
  {
    id: '103',
    title: 'Süper Lig\'de Fikstür Değişikliği: Derbi Tarihi Belli Oldu',
    category: 'Spor',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
    summary: 'TFF, yoğun maç takvimi nedeniyle 15. hafta programında değişikliğe gitti. Dev derbi hafta içine alındı.',
    date: '2023-10-26',
    time: '11:45',
    isHeadline: true,
    viewCount: 12500
  },
  {
    id: '104',
    title: 'Dünya Bu Olayı Konuşuyor: İklim Zirvesinde Şok Protesto',
    category: 'Dünya',
    imageUrl: 'https://images.unsplash.com/photo-1621274403997-37aace184f49?q=80&w=1000&auto=format&fit=crop',
    summary: 'Birleşmiş Milletler İklim Zirvesi sırasında sahneye atlayan aktivistler, liderlere zor anlar yaşattı.',
    date: '2023-10-26',
    time: '10:15',
    isHeadline: true,
    viewCount: 8700
  },
  
  // Teknoloji & Otomobil
  {
    id: '201',
    title: 'Elektrikli Araçlarda ÖTV Düzenlemesi Yolda',
    category: 'Otomobil',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1000&auto=format&fit=crop',
    summary: 'Bakanlık kaynaklarından alınan bilgiye göre, elektrikli araç ithalatında yeni vergi dilimleri belirlenecek.',
    date: '2023-10-25',
    time: '16:20',
    isHeadline: false,
    viewCount: 5600
  },
  {
    id: '202',
    title: 'iPhone 16 Sızıntıları: Tasarım Tamamen Değişiyor',
    category: 'Teknoloji',
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1000&auto=format&fit=crop',
    summary: 'Apple\'ın yeni amiral gemisi iPhone 16 hakkında ilk görseller sızdı. Kamera adası tarih oluyor.',
    date: '2023-10-25',
    time: '09:30',
    isHeadline: false,
    viewCount: 42000
  },
  {
    id: '203',
    title: 'Microsoft ve OpenAI Arasında Yeni Anlaşma',
    category: 'Teknoloji',
    imageUrl: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop',
    summary: 'Yapay zeka devi OpenAI, Microsoft ile olan ortaklığını derinleştiriyor. Yeni model GPT-5 yolda mı?',
    date: '2023-10-24',
    time: '18:45',
    isHeadline: false,
    viewCount: 35000
  },
  {
    id: '204',
    title: 'SpaceX Starship Fırlatması Başarılı',
    category: 'Teknoloji',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop',
    summary: 'Elon Musk\'ın Mars hayali gerçek oluyor. Starship roketi yörüngeye başarıyla yerleşti.',
    date: '2023-10-23',
    time: '21:15',
    isHeadline: false,
    viewCount: 51000
  },

  // Magazin & Yaşam
  {
    id: '301',
    title: 'Ünlü Oyuncu Setlere Geri Dönüyor',
    category: 'Magazin',
    imageUrl: 'https://images.unsplash.com/photo-1496440738360-be0f13568506?q=80&w=1000&auto=format&fit=crop',
    summary: 'Uzun süredir ekranlardan uzak olan sevilen oyuncu, dev bütçeli bir dijital platform dizisiyle anlaştı.',
    date: '2023-10-24',
    time: '21:00',
    isHeadline: false,
    viewCount: 18900
  },
  {
    id: '302',
    title: 'Kış Aylarında Bağışıklığı Güçlendiren 5 Besin',
    category: 'Sağlık',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop',
    summary: 'Uzmanlar uyarıyor: Grip salgınından korunmak için mutfağınızdan bu besinleri eksik etmeyin.',
    date: '2023-10-24',
    time: '08:00',
    isHeadline: false,
    viewCount: 7500
  },
   {
    id: '401',
    title: 'Borsa İstanbul Güne Rekorla Başladı',
    category: 'Ekonomi',
    imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1000&auto=format&fit=crop',
    summary: 'BIST 100 endeksi, açılışta bankacılık hisselerinin öncülüğünde tüm zamanların en yüksek seviyesini gördü.',
    date: '2023-10-26',
    time: '10:05',
    isHeadline: false,
    viewCount: 11200
  },
  {
    id: '402',
    title: 'Milli Voleybolcularımızdan Altın Madalya',
    category: 'Spor',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop',
    summary: 'Avrupa Şampiyonası\'nda mücadele eden Filenin Sultanları, finalde rakibini devirerek altın madalyaya uzandı.',
    date: '2023-10-25',
    time: '22:45',
    isHeadline: true,
    viewCount: 95000
  },
  // Gündem
  {
    id: '501',
    title: 'İstanbul\'da Toplu Ulaşıma Yeni Düzenleme',
    category: 'Gündem',
    imageUrl: 'https://images.unsplash.com/photo-1555619376-793574d75470?q=80&w=1000&auto=format&fit=crop',
    summary: 'Büyükşehir Belediyesi, metro ve metrobüs hatlarında sefer sayılarını artırma kararı aldı.',
    date: '2023-10-26',
    time: '08:15',
    isHeadline: false,
    viewCount: 6700
  },
  {
    id: '502',
    title: 'Eğitimde Yeni Dönem Başlıyor: Müfredat Değişikliği',
    category: 'Gündem',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1000&auto=format&fit=crop',
    summary: 'Milli Eğitim Bakanlığı, önümüzdeki eğitim-öğretim yılından itibaren geçerli olacak yeni müfredatı tanıttı.',
    date: '2023-10-25',
    time: '13:40',
    isHeadline: false,
    viewCount: 14500
  }
];

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
