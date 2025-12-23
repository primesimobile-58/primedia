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

## 4. Reklam Alanları
Sitede "Reklam Alanı" olarak işaretlenmiş bölgeler `[lang]/news/[id]/page.tsx` ve `MarketWidget.tsx` dosyalarındadır. Google Adsense veya özel reklam kodlarınızı bu kutuların içine yapıştırabilirsiniz.

## 5. Canlıya Alma (Güncelleme)
Yaptığınız her değişiklikten sonra, kodları GitHub'a göndermeniz yeterlidir. Vercel, değişikliği algılayıp siteyi **otomatik olarak günceller**.

```bash
git add .
git commit -m "Yeni özellikler eklendi"
git push origin main
```

Bu komutu yazdığınızda siteniz 2 dakika içinde güncellenir.
