# PRİMEDİA MASTER EDİTÖR KILAVUZU
(Versiyon 1.0.2 - Güncellendi)

Primedia "Master Editör" paneli, sitenizi profesyonelce yönetmeniz için tasarlanmış özel bir arayüzdür.

🚨 **DİKKAT:** Panele erişmek için doğru adresi kullandığınızdan emin olun.

*   **Panel Adresi:** `http://localhost:3000/tr/admin`
*   **Kullanıcı Adı:** (Gerekmez)
*   **Şifre:** `admin123`

---

## 1. Sisteme Giriş Yapma (Adım Adım)
1.  Tarayıcınızın adres çubuğuna `http://localhost:3000/tr/admin` yazın ve Enter'a basın.
    *   *Not: Sadece `/admin` yazarsanız hata alabilirsiniz. `/tr/admin` yazdığınızdan emin olun.*
2.  Karşınıza kilit simgeli bir giriş ekranı gelecektir.
3.  Şifre kutusuna `admin123` yazın.
4.  "Giriş Yap" butonuna tıklayın.

## 2. Haber Nasıl Üretilir?
Kod bilmenize gerek yoktur. "Haber Üreticisi" sekmesini kullanarak saniyeler içinde haber oluşturabilirsiniz.

### Adım A: Formu Doldurun
1.  Panelde **"Haber Üreticisi"** sekmesine tıklayın.
2.  **Başlık:** Haberin çarpıcı başlığını girin. (Örn: "Primedia Borsada Rekor Kırdı")
3.  **Kategori:** Haberin kategorisini seçin.
4.  **Görsel URL:** Haberin kapak fotoğrafını girin.
5.  **Özet & İçerik:** Haberin metinlerini girin.
6.  **Manşet/Son Dakika:** Önemli haberler için bu kutucukları işaretleyin.

### Adım B: Kodu Kopyalayın
1.  Formun altındaki siyah **"JSON Kodunu Oluştur"** butonuna tıklayın.
2.  Sağ taraftaki siyah kutuda kodlar oluşacaktır.
3.  **"Kopyala"** butonuna basarak kodu hafızaya alın.

### Adım C: Siteye Ekleyin (Çok Önemli!)
Web tarayıcıları güvenlik nedeniyle dosya sisteminize doğrudan yazamaz. Bu yüzden son adımı sizin yapmanız gerekir:

1.  VS Code editöründe `src/lib/data.ts` dosyasını açın.
2.  `Ctrl + F` (veya `Cmd + F`) yaparak `export const mockNews` satırını aratın.
3.  Bu satırın hemen altındaki `[` işaretinden sonra yeni bir satır açın.
4.  Kopyaladığınız kodu buraya yapıştırın (`Ctrl + V` veya `Cmd + V`).
5.  Dosyayı kaydedin (`Ctrl + S` veya `Cmd + S`).

**Sonuç:** Tarayıcınızı yenilediğinizde haberiniz anasayfada, manşette ve detay sayfalarında görünür olacaktır.

---

## 3. Sistem Durumu Kontrolü
"Sistem Durumu" sekmesinde:
*   **Sistem Sağlığı:** "AKTİF" yazıyorsa her şey yolundadır.
*   **Hızlı İşlemler:** `Sitemap Kontrol` butonuna tıklayarak Google'ın sitenizi nasıl gördüğünü test edebilirsiniz.

## Sorun Giderici
*   **"Sayfa bulunamadı (404)" hatası alıyorum:** Adresin `/tr/admin` olduğundan emin olun.
*   **Şifreyi kabul etmiyor:** `admin123` yazarken boşluk bırakmadığınızdan emin olun.
*   **Haber sitede görünmüyor:** `src/lib/data.ts` dosyasını kaydettiğinizden emin olun (Dosya isminin yanında beyaz nokta varsa kaydedilmemiş demektir).
