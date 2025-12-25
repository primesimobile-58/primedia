'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { incrementViewCount, addNews } from '@/lib/news-service'
import { trackVisit } from '@/lib/analytics-service'


// Analytics Actions
export async function viewNews(id: string) {
  await incrementViewCount(id);
  revalidatePath(`/news/${id}`);
  revalidatePath('/[lang]/admin');
}

export async function logVisit() {
  // In a real app, get IP/Country from headers
  await trackVisit('TR', 'direct');
  revalidatePath('/[lang]/admin');
}

// Login Action
export async function authenticate(prevState: any, formData: FormData) {
  const password = formData.get('password') as string
  console.log('Login attempt with:', password ? '***' : 'empty'); // Log attempt safely
  
  // Master Level: Normalize input
  if (password?.trim().toLowerCase() === 'admin123') {
    console.log('Login success');
    cookies().set('admin_session', 'authenticated', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    return { success: true, message: 'Giriş başarılı! Yönlendiriliyorsunuz...' }
  }
  
  console.log('Login failed');
  return { success: false, message: 'Hatalı şifre! Lütfen tekrar deneyin.' }
}

export async function logout() {
  cookies().delete('admin_session')
  return { success: true }
}

// Publish News Action
export async function publishNews(prevState: any, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const summary = formData.get('summary') as string
    const content = formData.get('content') as string
    const category = formData.get('category') as string
    const imageUrl = formData.get('imageUrl') as string
    const isHeadline = formData.get('isHeadline') === 'on'
    const isBreaking = formData.get('isBreaking') === 'on'

    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const newNewsItem = {
      id: `custom-${id}`,
      title,
      summary,
      content: content || `<p>${summary}</p>`,
      link: `/news/custom-${id}`,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000&auto=format&fit=crop',
      date: new Date().toLocaleDateString('tr-TR'),
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isHeadline,
      isBreaking,
      viewCount: 0
    };

    // Use centralized service
    await addNews(newNewsItem);
    
    // Revalidate cache globally
    revalidatePath('/', 'layout');
    revalidatePath('/[lang]/admin', 'page');
    revalidatePath('/[lang]', 'page');
    
    return { success: true, message: 'Haber başarıyla yayınlandı!' }
  } catch (error) {
    console.error('News publishing error:', error);
    return { success: false, message: 'Haber yayınlanırken bir hata oluştu.' }
  }
}
