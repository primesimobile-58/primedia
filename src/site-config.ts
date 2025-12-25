export const siteConfig = {
  // Reklam Alanı Konfigürasyonu
  // Buraya Google AdSense veya diğer reklam ağlarının verdiği "slot ID"leri girebilirsiniz.
  // Eğer boş bırakılırsa placeholder (yer tutucu) gösterilir.
  ads: {
    'header-top': '', // Leaderboard (728x90) - Header üstü
    'home-sidebar': '', // Rectangle (300x250) - Anasayfa Sidebar
    'news-sidebar': '', // Vertical (300x600) - Haber Detay Sidebar
    'news-content-bottom': '', // In-Article - Haber İçeriği Altı
  },
  
  // Sosyal Medya Bağlantıları
  socials: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    linkedin: 'https://linkedin.com',
  },
  
  // Site Ayarları
  features: {
    enableAds: true, // Reklamları global olarak aç/kapat
    enableComments: false,
    enableAnalytics: true,
  },

  // Analitik ve SEO
  analytics: {
    googleAnalyticsId: '', // 'G-XXXXXXXXXX'
  },
  
  contact: {
    email: 'info@primedia.com',
    phone: '+90 212 000 00 00',
    address: 'Maslak Mah. Büyükdere Cad. No:1 Sarıyer/İstanbul',
  }
};
