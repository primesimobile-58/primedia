import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  lang: string;
  dict: any;
}

export default function Footer({ lang, dict }: FooterProps) {
  return (
    <footer className="bg-primary text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tight">PRIMEDIA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {dict.common.footer_desc}
            </p>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase text-sm tracking-wider">{dict.footer.categories}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href={`/${lang}/category/gundem`} className="hover:text-white transition-colors">{dict.nav.agenda}</Link></li>
              <li><Link href={`/${lang}/category/ekonomi`} className="hover:text-white transition-colors">{dict.nav.economy}</Link></li>
              <li><Link href={`/${lang}/category/spor`} className="hover:text-white transition-colors">{dict.nav.sports}</Link></li>
              <li><Link href={`/${lang}/category/magazin`} className="hover:text-white transition-colors">{dict.nav.magazine}</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase text-sm tracking-wider">{dict.footer.corporate}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">{dict.footer.about}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{dict.footer.contact}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{dict.footer.privacy}</Link></li>
              <li><Link href={`/${lang}/admin`} className="hover:text-white transition-colors text-xs opacity-50 hover:opacity-100 flex items-center gap-1">
                Yönetici Girişi
              </Link></li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h4 className="font-semibold mb-4 text-secondary uppercase text-sm tracking-wider">{dict.footer.follow_us}</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-all hover:scale-110"><Twitter size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-all hover:scale-110"><Facebook size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-all hover:scale-110"><Instagram size={18} /></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-secondary transition-all hover:scale-110"><Youtube size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          {dict.common.copyright}
        </div>
      </div>
    </footer>
  );
}
