import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketWidget from "@/components/MarketWidget";
import AppBanner from "@/components/AppBanner";
import { fetchMarketData } from "@/lib/finance";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  
  return {
    title: {
      default: 'Primedia - ' + (dict.common?.home || 'Haberler'),
      template: '%s | Primedia'
    },
    description: dict.common?.footer_desc || 'Doğru, tarafsız ve güncel haberler.',
    manifest: '/manifest.json',
    icons: {
      icon: '/icon.svg',
      apple: '/icon.svg',
    },
    openGraph: {
      title: 'Primedia',
      description: dict.common?.footer_desc,
      siteName: 'Primedia',
      locale: params.lang,
      type: 'website',
    },
  };
}

import Advertisement from "@/components/Advertisement";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dict = await getDictionary(params.lang);
  const marketData = await fetchMarketData();
  const dir = params.lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={params.lang} dir={dir}>
      <GoogleAnalytics />
      <AnalyticsTracker />
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-gray-50 text-gray-900`}>
        {/* Header Ad - Leaderboard */}
        <div className="container mx-auto px-4 flex justify-center py-2 bg-gray-50">
          <Advertisement format="leaderboard" slot="header-top" />
        </div>
        
        <header className="sticky top-0 z-50 w-full">
          <MarketWidget dict={dict} data={marketData} lang={params.lang} />
          <Navbar lang={params.lang} dict={dict} />
        </header>
        {children}
        <Footer lang={params.lang} dict={dict} />
        <AppBanner lang={params.lang} />
      </body>
    </html>
  );
}
