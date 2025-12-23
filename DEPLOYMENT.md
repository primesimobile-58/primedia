# Primedia - Canlı Yayın (Deployment) Rehberi

Bu rehber, **Primedia** projesini `www.primedia.com.tr` adresinde yayına almak için izlemeniz gereken adımları içerir. Proje modern bir **Next.js** uygulamasıdır ve geleneksel HTML sitelerinden farklı olarak bir **Node.js** sunucusuna ihtiyaç duyar.

## 1. Hazırlık
Projeniz şu an yayına hazır durumdadır. Son sürüm dosyaları oluşturulmuştur.

## 2. Yayına Alma Seçenekleri

### Seçenek A: Vercel (En Hızlı ve Önerilen)
Next.js'in yaratıcısı Vercel, bu proje için en iyi performansı ve en kolay kurulumu sunar. hosting.com.tr'den aldığınız domaini buraya yönlendireceğiz.

1.  **Vercel Hesabı Açın:** [vercel.com](https://vercel.com) adresine gidin.
2.  **Projeyi Yükleyin:**
    *   Proje kodlarını GitHub, GitLab veya Bitbucket hesabınıza yükleyin.
    *   Vercel panelinden "Add New Project" diyerek deponuzu seçin.
    *   Hiçbir ayarı değiştirmeden "Deploy" butonuna basın.
3.  **Domain Bağlama:**
    *   Vercel'de proje ayarlarında **Settings > Domains** sekmesine gidin.
    *   `www.primedia.com.tr` adresini girin.
    *   Vercel size girmeniz gereken **DNS kayıtlarını** verecektir. Genellikle şöyledir:
        *   **A Kaydı:** `@` -> `76.76.21.21`
        *   **CNAME Kaydı:** `www` -> `cname.vercel-dns.com`
4.  **Hosting.com.tr Panel Ayarı (Önemli):**
    *   hosting.com.tr müşteri paneline giriş yapın.
    *   **Domainlerim** > `primedia.com.tr` > **DNS Yönetimi** (veya Gelişmiş DNS) menüsüne gidin.
    *   Mevcut A ve CNAME kayıtlarını silin (varsa).
    *   Yukarıdaki Vercel'in verdiği 2 kaydı ekleyin:
        *   **Tip:** A | **Ad:** @ (veya boş) | **Değer:** `76.76.21.21`
        *   **Tip:** CNAME | **Ad:** www | **Değer:** `cname.vercel-dns.com`
    *   Kaydet'e basın. Yönlendirmenin aktif olması 1-24 saat sürebilir.

### Seçenek B: hosting.com.tr Node.js Hosting (Eğer Hosting Paketi de Aldıysanız)
Eğer hosting.com.tr'den "Node.js destekli" bir Linux hosting paketi de aldıysanız (sadece domain değil), dosyaları oraya yükleyebilirsiniz:

1.  **cPanel'e Girin:** hosting.com.tr panelinden cPanel'e bağlanın.
2.  **Node.js App Oluşturun:**
    *   "Software" (Yazılım) bölümünde **"Setup Node.js App"**'e tıklayın.
    *   **Create Application** deyin.
    *   **Node.js Version:** 18.x veya 20.x seçin.
    *   **App Mode:** Production.
    *   **Application Root:** `primedia` yazın.
    *   **Application URL:** `primedia.com.tr` seçin.
    *   **Startup File:** `ecosystem.config.js` veya `npm run start` (hosting firmasının yapısına göre değişir, genelde `app.js` isterler, Next.js için özel `server.js` gerekebilir).
3.  **Dosyaları Yükleyin:**
    *   Dosya Yöneticisi ile `primedia` klasörüne projenin derlenmiş dosyalarını (`.next`, `public`, `package.json` vb.) yükleyin.
4.  **NPM Install:**
    *   Node.js App ekranında "Run NPM Install" butonuna basın.
5.  **Başlatın:** "Start App" butonuna basın.

*Not: Next.js projeleri için Vercel (Seçenek A) her zaman daha stabil ve performanslıdır.*

### Seçenek C: VPS / Sunucu (Ubuntu + Nginx)
Tam kontrol için sanal sunucu (VPS) kullanımı:

1.  **Sunucuya Bağlanın:** `ssh root@sunucu-ip-adresi`
2.  **Gereklilikleri Yükleyin:**
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs nginx
    sudo npm install -g pm2
    ```
3.  **Projeyi Çekin ve Kurun:**
    ```bash
    git clone <repo-url> /var/www/primedia
    cd /var/www/primedia
    npm install
    npm run build
    ```
4.  **Uygulamayı Başlatın (PM2 ile):**
    ```bash
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    ```
5.  **Nginx Ayarı (Reverse Proxy):**
    *   `/etc/nginx/sites-available/primedia` dosyası oluşturup port 3000'e yönlendirme yapın.
    *   Domaini sunucu IP'sine yönlendirin.

## 3. Web ve App (PWA) Hakkında
Sitemiz **PWA (Progressive Web App)** teknolojisine sahiptir.

*   **Web:** Kullanıcılar tarayıcıdan `www.primedia.com.tr` adresine girdiklerinde site normal bir web sitesi gibi çalışır.
*   **App:**
    *   **iOS (iPhone):** Safari'de siteyi açıp "Paylaş" > "Ana Ekrana Ekle" dediklerinde, site telefonlarına bir uygulama gibi yüklenir. Adres çubuğu kaybolur ve tam ekran çalışır.
    *   **Android:** Chrome'da siteye girdiklerinde altta otomatik olarak "Primedia Uygulamasını Yükle" bandı çıkar.

**Marketlere Yükleme (Opsiyonel):**
Eğer uygulamanın App Store ve Google Play Store'da da yer almasını isterseniz, bu PWA yapısını "paketlemeniz" gerekir. Bunun için **CapacitorJS** veya **TWA (Trusted Web Activity)** teknolojileri kullanılır. Bu işlem ayrı bir geliştirme süreci (build alma, sertifikalama, market hesapları açma vb.) gerektirir. Şu anki altyapımız buna uygundur.

## 4. Dashboard / Yönetim
Next.js projelerinde içerik yönetimi için genellikle bir **Headless CMS** (Strapi, Sanity vb.) kullanılır. Şu an projemiz verileri `src/lib/data.ts` ve `src/lib/rss.ts` üzerinden çekmektedir.

*   **Haberler:** RSS kaynaklarından (Fotomaç vb.) otomatik çekilir, sizin manuel giriş yapmanıza gerek yoktur.
*   **Sabit İçerikler:** Kod içerisindeki veri dosyalarından yönetilir.

İleride özel bir admin paneli isterseniz, projeye bir CMS (İçerik Yönetim Sistemi) entegre edilebilir.
