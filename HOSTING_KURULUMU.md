# CANLI YAYIN VE HOSTING KURULUM REHBERİ

Bu rehber, `primedia.com.tr` adresinizi hazırladığımız web sitesine bağlamanız için adım adım hazırlanmıştır. Lütfen sırasıyla uygulayın.

## BÖLÜM 1: VERCEL (Sitenin Motoru)

Önce sitenizi Vercel'e yükleyip "DNS Değerlerini" almamız gerekiyor.

1.  **Vercel'e Giriş Yapın:**
    *   [vercel.com](https://vercel.com) adresine gidin.
    *   "Log In" veya "Sign Up" diyerek **GitHub hesabınızla** giriş yapın.

2.  **Projeyi İçeri Aktarın (Import):**
    *   Vercel ana sayfasında **"Add New..."** butonuna tıklayın, sonra **"Project"** seçin.
    *   Listenin sol tarafında `primesimobile-58/primedia` (veya sizin GitHub kullanıcı adınız) projesini göreceksiniz.
    *   Yanındaki **"Import"** butonuna basın.
    *   Açılan sayfada hiçbir şeyi değiştirmeden mavi renkli **"Deploy"** butonuna basın.
    *   *Bekleyin (1-2 dakika)...* Ekranda konfetiler patlayınca site yayında demektir!

3.  **Domain Ayarını Başlatın:**
    *   Deploy bitince **"Continue to Dashboard"** butonuna basın.
    *   Yukarıdaki menüden **"Settings"** (Ayarlar) sekmesine tıklayın.
    *   Soldaki menüden **"Domains"** seçeneğine tıklayın.
    *   Kutucuğa `www.primedia.com.tr` yazın ve **"Add"** butonuna basın.
    *   Karşınıza bir hata veya uyarı çıkacak (kırmızı/sarı). Bu normaldir. Orada size verilen değerleri not edin.
    *   Genellikle şöyledir (Ama ekrandakini kontrol edin!):
        *   **A Record:** `76.76.21.21`
        *   **CNAME Record:** `cname.vercel-dns.com`

---

## BÖLÜM 2: HOSTING.COM.TR (Adres Yönlendirme)

Şimdi bu değerleri domain firmanıza gireceğiz.

1.  **Panele Giriş:**
    *   [hosting.com.tr](https://www.hosting.com.tr) müşteri paneline giriş yapın.

2.  **DNS Yönetimine Gidin:**
    *   Menüden **"Domainlerim"** (veya Alan Adlarım) kısmına tıklayın.
    *   `primedia.com.tr` satırını bulun.
    *   Genellikle sağ tarafta **"Yönet"** butonu olur, ona basın.
    *   Açılan sayfada **"DNS Yönetimi"**, **"Gelişmiş DNS"** veya **"DNS Bölgesi Düzenleme"** gibi bir seçenek arayın ve tıklayın.

3.  **Eski Kayıtları Temizleyin (Önemli!):**
    *   Listede "Tür" (Type) kısmı **A** olan ve "Değer" kısmı hosting firmasına ait IP olan kayıtları **SİLİN**.
    *   Listede "Tür" kısmı **CNAME** olan ve "Ad" kısmı **www** olan kayıtları **SİLİN**.
    *   *(Korkmayın, siteniz zaten boş olduğu için bir şey kaybetmezsiniz.)*

4.  **Yeni Kayıtları Ekleyin:**
    *   Şimdi Vercel'in verdiği değerleri ekleyeceğiz. Genelde "Yeni Kayıt Ekle" butonu ile yapılır.

    **1. Kayıt (Ana Adres için):**
    *   **Kayıt Tipi (Type):** `A` seçin.
    *   **Ad (Host/Name):** `@` yazın (Eğer `@` kabul etmezse boş bırakın).
    *   **Değer (Value/IP):** `76.76.21.21` (Vercel'deki A Record değeri).
    *   **TTL:** Otomatik veya 3600 kalabilir.
    *   **Kaydet/Ekle** butonuna basın.

    **2. Kayıt (www için):**
    *   **Kayıt Tipi (Type):** `CNAME` seçin.
    *   **Ad (Host/Name):** `www` yazın.
    *   **Değer (Value/Target):** `cname.vercel-dns.com` (Vercel'deki CNAME değeri).
    *   **TTL:** Otomatik veya 3600 kalabilir.
    *   **Kaydet/Ekle** butonuna basın.

## SONUÇ
İşlemler bu kadar!
*   Yönlendirmenin dünya geneline yayılması **15 dakika ile 24 saat** arasında sürebilir.
*   Vercel panelindeki Domains sayfasında kırmızı hata kaybolup **yeşil tik** olduğunda işlem tamamlanmış demektir.
