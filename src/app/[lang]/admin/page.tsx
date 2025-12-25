import { cookies } from 'next/headers';
import AdminClient from './AdminClient';
import { getNews } from '@/lib/news-service';
import { getAnalytics } from '@/lib/analytics-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Master Editor | Primedia',
  description: 'Primedia İçerik Yönetim Paneli',
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAuthenticated = cookieStore.get('admin_session')?.value === 'authenticated';
  
  // Fetch dynamic data
  const news = await getNews();
  const analytics = await getAnalytics();

  return <AdminClient initialAuth={isAuthenticated} news={news} analytics={analytics} />;
}
