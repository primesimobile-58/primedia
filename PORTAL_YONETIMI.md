# PRİMEDİA PORTAL YÖNETİM REHBERİ

Primedia portalı, "Master Seviye" otomasyon teknolojisiyle çalışır. Geleneksel haber sitelerinin aksine, sürekli manuel veri girişi gerektirmez; ancak tam kontrol sizdedir.

## 1. Haber Kaynaklarını Yönetme (Otomatik İçerik)
Sitenizdeki haberler, dünyanın en güvenilir kaynaklarından (RSS) otomatik çekilir. Bu kaynakları değiştirmek isterseniz:

*   **Dosya:** `src/lib/rss.ts`
*   **Nasıl Yapılır:** Bu dosyada `RSS_SOURCES` listesini göreceksiniz.
    *   Örneğin "Spor" haberlerini Fotomaç yerine Fanatik'ten çekmek isterseniz, ilgili linki değiştirmeniz yeterlidir.
    *   Sistem, yeni linkteki haberleri anında tarar, görselleri işler ve siteye yerleştirir.

## 2. Borsa ve Finans Verileri
Finans modülü, Yahoo Finance ve TradingView altyapısını kullanır.
*   **Hisse Ekleme/Çıkarma:** `src/lib/finance.ts` dosyasında takip edilen sembolleri (Örn: THYAO.IS, GARAN.IS, AAPL) değiştirebilirsiniz.
*   **Grafik Ayarları:** `src/components/TradingViewWidget.tsx` üzerinden varsayılan grafiği değiştirebilirsiniz.

## 3. Sabit İçerikler (Menüler, Yazarlar, Video Galeri)
*   **Menü ve Çeviriler:** `src/dictionaries` klasöründe `tr.json`, `en.json`, `ar.json` dosyaları bulunur. Sitedeki "Hakkımızda", "Künye" gibi sabit metinleri buradan düzenleyebilirsiniz.
*   **Köşe Yazarları:** `src/lib/data.ts` içindeki `mockAuthors` kısmından yazar ekleyip çıkarabilirsiniz.
*   **Video Galeri:** Şimdilik `mockVideos` üzerinden yönetilmektedir. İleride YouTube kanalınıza bağlanabilir.

## 4. Reklam ve Site Ayarları
Reklam alanlarını, sosyal medya linklerini ve genel site özelliklerini tek bir dosyadan yönetebilirsiniz.

*   **Dosya:** `src/site-config.ts`
*   **Reklamlar:** `ads` bölümüne Google Adsense veya diğer ağların size verdiği "Slot ID"lerini girin.
    *   `header-top`: Logo üstündeki uzun reklam (728x90)
    *   `home-sidebar`: Anasayfa sağındaki kutu reklam (300x250)
    *   `news-sidebar`: Haber detayındaki dikey reklam (300x600)
    *   `news-content-bottom`: Haber metninin bitimindeki reklam
*   **Sosyal Medya:** Facebook, Twitter vb. linklerinizi `socials` kısmından güncelleyebilirsiniz.
*   **Özellikler:** `enableAds: false` yaparak tüm reklamları tek tuşla kapatabilirsiniz.

## 5. Master Editör Araçları (YENİ)
Sitenizi yönetmek ve içerik üretmek için artık bir yönetim paneline sahipsiniz.

*   **Panel Adresi:** `siteniz.com/tr/admin`
*   **Özellikler:**
    *   **Sistem Sağlığı:** RSS kaynaklarının ve entegrasyonların çalışıp çalışmadığını anlık kontrol edebilirsiniz.
    *   **Haber Üreticisi:** Kod yazmadan özel haber oluşturmanızı sağlar. Formu doldurun, üretilen JSON kodunu kopyalayın ve `src/lib/data.ts` dosyasına yapıştırın.

## 6. SEO ve Analitik (Unicorn Stratejisi)
Marka olmak için görünürlük şarttır. Bu altyapı hazırlandı:

*   **Google Analytics:** `src/site-config.ts` dosyasındaki `googleAnalyticsId` alanına 'G-XXXXXX' kodunuzu girin. Ziyaretçi takibi otomatik başlar.
*   **Sitemap & Robots.txt:** Google botları için `sitemap.xml` ve `robots.txt` dosyaları otomatik oluşturulur. Ekstra işlem yapmanıza gerek yoktur.

## 7. Canlıya Alma (Güncelleme)
Yaptığınız her değişiklikten sonra, kodları GitHub'a göndermeniz yeterlidir. Vercel, değişikliği algılayıp siteyi **otomatik olarak günceller**.

```bash
git add .
git commit -m "Yeni özellikler eklendi"
git push origin main
```

Bu komutu yazdığınızda siteniz 2 dakika içinde güncellenir.
