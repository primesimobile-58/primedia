'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  Activity, Database, Rss, Copy, Check, ExternalLink, Lock, 
  Eye, EyeOff, FileText, Image as ImageIcon, KeyRound, 
  LogOut, UploadCloud, AlertCircle, LayoutDashboard, Globe, Users, TrendingUp,
  Zap, BarChart3, PieChart, ArrowUpRight, ShieldCheck, PenTool
} from 'lucide-react';
import { authenticate, logout, publishNews } from '../../actions';

interface AdminClientProps {
  initialAuth: boolean;
  news: any[];
  analytics: any;
}

// Unicorn Button Component
function SubmitButton({ text, icon: Icon, loadingText, variant = 'primary' }: { text: string, icon: any, loadingText: string, variant?: 'primary' | 'secondary' }) {
  const { pending } = useFormStatus();
  
  const baseClasses = "w-full py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-xl relative overflow-hidden group";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50",
    secondary: "bg-white text-gray-800 border border-gray-100 shadow-gray-200/50 hover:bg-gray-50"
  };

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none" />
      {pending ? (
        <>
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingText}
        </>
      ) : (
        <>
          <Icon size={20} className="relative z-10" />
          <span className="relative z-10">{text}</span>
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
      router.refresh(); 
    }
  }, [loginState, router]);

  // Effects for Publish
  useEffect(() => {
    if (publishState.message) {
      const timer = setTimeout(() => {
        // Reset logic handled by re-render
      }, 5000);
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
  
  // News Form State
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
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-md w-full border border-white/20 relative z-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500" />
          
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/30 transform -rotate-6 hover:rotate-0 transition-all duration-500">
              <Lock size={42} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Master Editor</h1>
            <p className="text-gray-400 font-medium tracking-wide text-sm uppercase">Secure Access Portal</p>
          </div>

          <form action={loginAction} className="space-y-6">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-400 transition-colors">
                  <KeyRound size={20} />
                </div>
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-12 bg-gray-900/50 border border-gray-700 rounded-2xl focus:bg-gray-900 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-white placeholder-gray-600"
                  placeholder="Access Key..."
                  autoFocus
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {loginState.message && (
              <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${loginState.success ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                {loginState.success ? <Check size={18} /> : <AlertCircle size={18} />}
                {loginState.message}
              </div>
            )}
            
            <div className="space-y-4 pt-2">
              <SubmitButton text="Unlock Portal" icon={LayoutDashboard} loadingText="Authenticating..." />
              
              <button 
                type="button"
                onClick={fillPassword}
                className="w-full py-4 bg-white/5 border border-white/10 text-gray-400 font-semibold rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
              >
                Use Demo Key
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
             <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">System v2.4 • Unicorn Grade Security</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-violet-500/30">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                Master Editor
                <span className="px-2 py-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[10px] font-black uppercase tracking-wider rounded-md shadow-lg shadow-violet-500/20">Pro</span>
              </h1>
              <p className="text-xs text-gray-400 font-medium">Real-time Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('status')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'status' ? 'bg-white text-gray-900 shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Activity size={16} />
              Status
            </button>
            <button 
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'generator' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <PenTool size={16} />
              Generator
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 md:p-8">
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
            
            {/* KPI Cards */}
            <div className="md:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-green-500/20 text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <ShieldCheck size={24} />
                </div>
                <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"/>
                  ONLINE
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">Active</h3>
              <p className="text-sm text-gray-400">System Status</p>
            </div>

            <div className="md:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20">
                  +12% Today
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{analytics?.totalVisits?.toLocaleString() || 0}</h3>
              <p className="text-sm text-gray-400">Total Visitors</p>
            </div>

            <div className="md:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-purple-500/20 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <Eye size={24} />
                </div>
                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20">
                  Live
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{totalViews.toLocaleString()}</h3>
              <p className="text-sm text-gray-400">Total Reads</p>
            </div>

            <div className="md:col-span-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full border border-orange-500/20">
                  Indexed
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-1">{news.length}</h3>
              <p className="text-sm text-gray-400">Total Articles</p>
            </div>

            {/* Main Content Area */}
            <div className="md:col-span-8 grid gap-6">
              {/* Most Read Chart */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                 <div className="flex items-center justify-between mb-8">
                   <div>
                     <h3 className="text-xl font-bold text-white flex items-center gap-2">
                       <TrendingUp size={20} className="text-violet-400"/>
                       Top Content Performance
                     </h3>
                     <p className="text-sm text-gray-400 mt-1">Highest engaging articles this week</p>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                    {mostReadNews.map((item, index) => (
                      <div key={item.id} className="group relative">
                        <div className="absolute inset-0 bg-white/5 rounded-2xl transform scale-[0.98] opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
                        <div className="relative p-4 flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-lg ${
                             index === 0 ? 'bg-yellow-500 text-yellow-950 shadow-yellow-500/20' : 
                             index === 1 ? 'bg-gray-300 text-gray-900' : 
                             index === 2 ? 'bg-orange-400 text-orange-950' :
                             'bg-white/10 text-white'
                           }`}>
                             #{index + 1}
                           </div>
                           <div className="flex-1 min-w-0">
                             <a href={item.link} target="_blank" className="font-bold text-white truncate block hover:text-violet-400 transition-colors">
                               {item.title}
                             </a>
                             <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                               <span className="flex items-center gap-1">
                                 <Eye size={12} /> {(item.viewCount || 0).toLocaleString()} views
                               </span>
                               <span className="w-1 h-1 bg-gray-600 rounded-full" />
                               <span>{item.category}</span>
                             </div>
                           </div>
                           <div className="hidden md:block">
                             <a href={item.link} target="_blank" className="p-2 bg-white/5 hover:bg-white/20 rounded-lg text-gray-400 hover:text-white transition-all">
                               <ExternalLink size={16} />
                             </a>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Side Panel - Country Stats */}
            <div className="md:col-span-4 space-y-6">
               <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                       <h3 className="text-xl font-bold text-white flex items-center gap-2">
                         <Globe size={20} className="text-blue-400"/>
                         Global Reach
                       </h3>
                       <p className="text-sm text-gray-400 mt-1">Visitor distribution by region</p>
                     </div>
                   </div>

                   <div className="space-y-4">
                     {countryStats.map(([country, count]: any, index) => {
                       const max = (countryStats[0] as any)[1] || 1;
                       const percentage = Math.round((count / max) * 100);
                       
                       return (
                         <div key={country} className="space-y-2">
                           <div className="flex justify-between text-sm font-medium">
                             <span className="text-white flex items-center gap-2">
                               <span className="w-6 h-4 bg-white/10 rounded text-[10px] flex items-center justify-center border border-white/10">{country}</span>
                               {country === 'TR' ? 'Turkey' : country === 'US' ? 'USA' : country}
                             </span>
                             <span className="text-gray-400">{count.toLocaleString()}</span>
                           </div>
                           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                               style={{ width: `${percentage}%` }}
                             />
                           </div>
                         </div>
                       );
                     })}
                   </div>
               </div>
            </div>

          </div>
        )}

        {activeTab === 'generator' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                 <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <FileText size={28} className="text-white" />
                 </div>
                 <div>
                   <h3 className="font-bold text-2xl text-white">Content Creator</h3>
                   <p className="text-sm text-gray-400 mt-1">AI-Enhanced News Generation Protocol</p>
                 </div>
              </div>
              
              <form action={publishAction} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Headline Title</label>
                  <input 
                    name="title"
                    type="text" 
                    required
                    className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-white placeholder-gray-600"
                    placeholder="Enter a striking headline..."
                    onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Category</label>
                    <div className="relative">
                      <select 
                        name="category"
                        className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-white appearance-none cursor-pointer"
                        onChange={(e) => setNewsForm({...newsForm, category: e.target.value})}
                      >
                        <option>Gündem</option>
                        <option>Ekonomi</option>
                        <option>Spor</option>
                        <option>Teknoloji</option>
                        <option>Magazin</option>
                        <option>Dünya</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Database size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Image URL</label>
                     <div className="relative">
                       <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                       <input 
                         name="imageUrl"
                         type="text" 
                         className="w-full pl-12 p-4 bg-gray-900/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-white placeholder-gray-600"
                         placeholder="https://..."
                         onChange={(e) => setNewsForm({...newsForm, imageUrl: e.target.value})}
                       />
                     </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Summary (Spot)</label>
                  <textarea 
                    name="summary"
                    required
                    className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-2xl h-32 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-white placeholder-gray-600 resize-none leading-relaxed"
                    placeholder="Brief summary of the news..."
                    onChange={(e) => setNewsForm({...newsForm, summary: e.target.value})}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 ml-1">Content (HTML Support)</label>
                  <textarea 
                    name="content"
                    className="w-full p-4 bg-gray-900/50 border border-white/10 rounded-2xl h-64 font-mono text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-gray-300 placeholder-gray-600 leading-relaxed"
                    placeholder="<p>Detailed news content...</p>"
                    onChange={(e) => setNewsForm({...newsForm, content: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                  <label className="flex items-center gap-4 cursor-pointer group flex-1">
                    <div className="relative flex items-center">
                      <input 
                        name="isHeadline"
                        type="checkbox" 
                        className="peer sr-only"
                        onChange={(e) => setNewsForm({...newsForm, isHeadline: e.target.checked})}
                      />
                      <div className="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-violet-600 transition-colors"></div>
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white group-hover:text-violet-400 transition-colors">Headline</span>
                      <span className="text-xs text-gray-500">Feature on main slider</span>
                    </div>
                  </label>

                  <div className="w-px bg-white/10 my-1"></div>

                  <label className="flex items-center gap-4 cursor-pointer group flex-1 justify-end">
                    <div className="text-right">
                      <span className="block text-sm font-bold text-white group-hover:text-red-400 transition-colors">Breaking News</span>
                      <span className="text-xs text-gray-500">Urgent ticker display</span>
                    </div>
                    <div className="relative flex items-center">
                      <input 
                        name="isBreaking"
                        type="checkbox" 
                        className="peer sr-only"
                        onChange={(e) => setNewsForm({...newsForm, isBreaking: e.target.checked})}
                      />
                      <div className="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 transition-colors"></div>
                    </div>
                  </label>
                </div>
                
                {publishState.message && (
                  <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${publishState.success ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                    {publishState.success ? <Check size={18} /> : <AlertCircle size={18} />}
                    {publishState.message}
                  </div>
                )}

                <SubmitButton text="Publish Content" icon={UploadCloud} loadingText="Deploying..." />
              </form>
            </div>

            {/* Preview Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-200 text-gray-900">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                  <Eye size={20} className="text-violet-600"/>
                  Live Preview
                  <span className="text-xs font-normal text-gray-400 ml-auto">Mobile Viewport</span>
                </h3>
                
                <div className="border-[8px] border-gray-900 rounded-[2.5rem] overflow-hidden bg-gray-50 h-[600px] relative shadow-inner">
                   {/* Phone Notch */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
                   
                   {/* Content */}
                   <div className="h-full overflow-y-auto custom-scrollbar">
                     <div className="bg-white pb-6">
                        {/* Header Mock */}
                        <div className="h-14 bg-red-600 flex items-center justify-center text-white font-bold text-lg mb-0 sticky top-0 z-10 shadow-sm">
                          PRIMEDIA
                        </div>

                        {newsForm.isBreaking && (
                          <div className="bg-red-700 text-white text-xs font-bold p-2 px-4 flex items-center gap-2">
                             <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                             SON DAKİKA
                          </div>
                        )}
                        
                        <div className="relative aspect-[4/3] bg-gray-200">
                          {newsForm.imageUrl ? (
                            <img src={newsForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100 gap-2">
                              <ImageIcon size={32} />
                              <span className="text-xs font-medium">No Image</span>
                            </div>
                          )}
                          {newsForm.isHeadline && (
                             <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                               <div className="text-white font-bold text-lg leading-tight line-clamp-2">
                                 {newsForm.title || 'Haber Başlığı Buraya Gelecek'}
                               </div>
                             </div>
                          )}
                        </div>

                        <div className="p-4 space-y-4">
                           {!newsForm.isHeadline && (
                             <h1 className="font-bold text-xl leading-tight text-gray-900">
                               {newsForm.title || 'Haber Başlığı Buraya Gelecek'}
                             </h1>
                           )}

                           <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                              <span className="text-red-600 uppercase">{newsForm.category}</span>
                              <span>•</span>
                              <span>Az önce</span>
                           </div>
                           
                           <p className="font-bold text-gray-600 text-sm leading-relaxed">
                             {newsForm.summary || 'Haberin kısa özeti (spot) burada görünecek. Çarpıcı ve dikkat çekici bir giriş metni.'}
                           </p>
                           
                           <div className="prose prose-sm max-w-none text-gray-800">
                              {newsForm.content ? (
                                <div dangerouslySetInnerHTML={{ __html: newsForm.content }} />
                              ) : (
                                <p className="text-gray-400 italic">Haberin detaylı içeriği buraya gelecek...</p>
                              )}
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl">
                 <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                   <Zap size={18} className="text-yellow-400"/>
                   Pro Tips
                 </h4>
                 <ul className="space-y-2 text-sm text-gray-400">
                   <li className="flex items-start gap-2">
                     <span className="text-violet-400">•</span>
                     Use high-resolution images (min 1200x800px) for better engagement.
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-violet-400">•</span>
                     Keep headlines under 60 characters for optimal SEO.
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="text-violet-400">•</span>
                     Use HTML tags like &lt;h3&gt; and &lt;p&gt; to structure your content properly.
                   </li>
                 </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
