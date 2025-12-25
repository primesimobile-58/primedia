'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Activity, Database, Rss, Copy, Check, ExternalLink, Lock, 
  Eye, EyeOff, FileText, Image as ImageIcon, KeyRound, 
  LogOut, UploadCloud, AlertCircle, LayoutDashboard, Globe, Users, TrendingUp 
} from 'lucide-react';
import { authenticate, logout, publishNews } from '../../actions';
import WorldMap from '@/components/WorldMap';

interface AdminClientProps {
  initialAuth: boolean;
  news: any[];
  analytics: any;
}

// Submit Button Component
function SubmitButton({ text, icon: Icon, loadingText }: { text: string, icon: any, loadingText: string }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
    >
      {pending ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={20} />
          {text}
        </>
      )}
    </button>
  );
}

const initialState = {
  success: false,
  message: '',
};

export default function AdminClient({ initialAuth, news, analytics }: AdminClientProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  
  // Server Action States
  const [loginState, loginAction] = useFormState(authenticate, initialState);
  const [publishState, publishAction] = useFormState(publishNews, initialState);

  // Calculate stats
  const totalViews = news.reduce((acc, item) => acc + (item.viewCount || 0), 0);
  const mostReadNews = [...news].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
  const countryStats = Object.entries(analytics?.visitsByCountry || {}).sort(([,a]: any, [,b]: any) => b - a).slice(0, 5);

  // Effects for Login
  useEffect(() => {
    if (loginState.success) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      router.refresh(); // Sync server state
    }
  }, [loginState, router]);

  // Effects for Publish
  useEffect(() => {
    if (publishState.message) {
      // Clear message after 3 seconds
      const timer = setTimeout(() => {
        // Reset logic if needed, but we can't easily reset useFormState without a wrapper
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [publishState]);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    setPassword('');
    router.refresh();
  };

  const fillPassword = () => {
    setPassword('admin123');
  };

  // Tabs
  const [activeTab, setActiveTab] = useState<'status' | 'generator'>('status');
  
  // News Form State (Client side tracking for preview/validation if needed)
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Gündem',
    imageUrl: '',
    summary: '',
    content: '',
    isHeadline: false,
    isBreaking: false
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner transform rotate-3">
              <Lock size={36} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Master Editor</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">Primedia Yönetim Paneli</p>
          </div>

          <form action={loginAction} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Yönetici Şifresi</label>
              <div className="relative group">
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-800"
                  placeholder="••••••••"
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {loginState.message && (
              <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${loginState.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {loginState.success ? <Check size={18} /> : <AlertCircle size={18} />}
                {loginState.message}
              </div>
            )}
            
            <div className="space-y-3">
              <SubmitButton text="Panele Giriş Yap" icon={LayoutDashboard} loadingText="Giriş Yapılıyor..." />
              
              <button 
                type="button"
                onClick={fillPassword}
                className="w-full py-3 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <KeyRound size={16} />
                Demo Şifre Kullan
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
             <p className="text-[10px] text-gray-400 font-medium">v2.0.0 • Secure Access • Unicorn Mode</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              Master Editor
              <span className="px-3 py-1 bg-gradient-to-r from-primary to-purple-600 text-white text-xs rounded-full font-bold shadow-lg shadow-primary/20">PRO</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">İçerik üretim ve yönetim merkezi</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'status' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Activity size={18} />
              Durum
            </button>
            <button 
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'generator' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <FileText size={18} />
              Haber Üreticisi
            </button>
            <div className="w-px h-8 bg-gray-200 mx-1"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            {/* System Health */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Sistem Sağlığı</h3>
                  <p className="text-xs text-gray-500">Canlı Metrikler</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-green-50/50 rounded-xl border border-green-100">
                  <span className="font-medium text-green-900">Portal</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-white text-green-700 text-xs rounded-full font-bold shadow-sm border border-green-100">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    AKTİF
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <span className="font-medium text-blue-900 flex items-center gap-2">
                    <Users size={16} /> Ziyaretçiler
                  </span>
                  <span className="px-3 py-1 bg-white text-blue-700 text-xs rounded-full font-bold shadow-sm border border-blue-200">
                    {analytics?.totalVisits?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                  <span className="font-medium text-purple-900 flex items-center gap-2">
                    <Eye size={16} /> Okunma
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full font-bold shadow-sm border border-purple-200">
                    {totalViews.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Ziyaretçi Analizi</h3>
                  <p className="text-xs text-gray-500">Ülke Bazlı Erişim</p>
                </div>
              </div>
              <div className="space-y-3">
                {countryStats.map(([country, count]: any, index) => (
                   <div key={country} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                     <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          {index + 1}
                        </span>
                        <span className="font-bold text-gray-700">{country}</span>
                     </div>
                     <span className="font-mono text-sm text-gray-600">{count.toLocaleString()}</span>
                   </div>
                ))}
                {countryStats.length === 0 && (
                  <div className="text-center py-4 text-gray-400 text-sm">Veri bulunamadı</div>
                )}
              </div>
            </div>

             {/* Content Performance */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">En Çok Okunanlar</h3>
                  <p className="text-xs text-gray-500">İçerik Performansı</p>
                </div>
              </div>
              <div className="space-y-3">
                {mostReadNews.map((item, index) => (
                  <div key={item.id} className="p-3 bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 rounded-xl transition-all group/link">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-gray-100 text-gray-700' : 
                        'bg-orange-100 text-orange-700'
                      }`}>#{index + 1}</span>
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Eye size={12} /> {(item.viewCount || 0).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-medium text-sm text-gray-700 line-clamp-2" title={item.title}>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Form */}
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                 <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                   <FileText size={24} />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl text-gray-900">Haber Oluştur</h3>
                   <p className="text-sm text-gray-500">İçeriği girin ve anında yayınlayın</p>
                 </div>
              </div>
              
              <form action={publishAction} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Başlık</label>
                  <input 
                    name="title"
                    type="text" 
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="Çarpıcı bir başlık girin..."
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                    <select 
                      name="category"
                      className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                      onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                    >
                      <option>Gündem</option>
                      <option>Ekonomi</option>
                      <option>Spor</option>
                      <option>Teknoloji</option>
                      <option>Magazin</option>
                      <option>Dünya</option>
                    </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-2">Görsel URL</label>
                     <div className="relative">
                       <ImageIcon size={18} className="absolute left-3 top-3.5 text-gray-400" />
                       <input 
                         name="imageUrl"
                         type="text" 
                         className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                         placeholder="https://..."
                         onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})}
                       />
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Özet (Spot)</label>
                  <textarea 
                    name="summary"
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl h-24 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="Haberin kısa özeti..."
                    onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">İçerik (HTML)</label>
                  <textarea 
                    name="content"
                    className="w-full p-3 border border-gray-200 rounded-xl h-48 font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="<p>Haberin detaylı içeriği...</p>"
                    onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        name="isHeadline"
                        type="checkbox" 
                        className="peer sr-only"
                        onChange={(e) => setNewsForm({...newsForm, isHeadline: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Manşet</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        name="isBreaking"
                        type="checkbox" 
                        className="peer sr-only"
                        onChange={(e) => setNewsForm({...newsForm, isBreaking: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-red-600 transition-colors">Son Dakika</span>
                  </label>
                </div>
                
                {publishState.message && (
                  <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${publishState.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {publishState.success ? <Check size={18} /> : <AlertCircle size={18} />}
                    {publishState.message}
                  </div>
                )}

                <SubmitButton text="Haberi Yayınla" icon={UploadCloud} loadingText="Yayınlanıyor..." />
              </form>
            </div>

            {/* Preview Card */}
            <div className="space-y-6">
              <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl border border-gray-800">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Eye size={20} className="text-primary"/>
                  Canlı Önizleme
                </h3>
                <div className="bg-white text-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 bg-gray-200 relative">
                    {newsForm.imageUrl ? (
                      <img src={newsForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                        <ImageIcon size={48} />
                      </div>
                    )}
                    {newsForm.category && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-bold rounded shadow-lg">
                        {newsForm.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-xl mb-2 line-clamp-2">{newsForm.title || 'Haber başlığı burada görünecek...'}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3">{newsForm.summary || 'Haber özeti burada yer alacak...'}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date().toLocaleDateString('tr-TR')}</span>
                      <span>0 Okunma</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Not: Yayınlandıktan sonra anasayfada en üstte görünecektir.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
