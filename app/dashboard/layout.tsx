"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/command-menu";
import { BarChart3, Users, Zap, Bell, Search, LayoutDashboard, MessageSquare, Settings, LogOut, Globe2, Cpu, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#030712] text-foreground overflow-hidden">
      <CommandMenu />
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#030712] hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-xs">A</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Alya</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">Platform</div>
          <SidebarItem 
            href="/dashboard" 
            icon={<LayoutDashboard size={18} />} 
            label="Overview" 
            active={pathname === "/dashboard"} 
          />
          <SidebarItem 
            href="/dashboard/audience" 
            icon={<Users size={18} />} 
            label="Audience" 
            active={pathname === "/dashboard/audience"} 
          />
          <SidebarItem 
            href="/dashboard/campaigns" 
            icon={<MessageSquare size={18} />} 
            label="Campaigns" 
            active={pathname === "/dashboard/campaigns"} 
          />
          <SidebarItem 
            href="/dashboard/automations" 
            icon={<Zap size={18} />} 
            label="Automations" 
            active={pathname === "/dashboard/automations"} 
          />
          <SidebarItem 
            href="/dashboard/analytics" 
            icon={<BarChart3 size={18} />} 
            label="Analytics" 
            active={pathname === "/dashboard/analytics"} 
          />
          <SidebarItem 
            href="/dashboard/engines" 
            icon={<Globe2 size={18} />} 
            label="Engines" 
            active={pathname === "/dashboard/engines"} 
          />

          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4 px-2">Settings</div>
          <SidebarItem 
            href="/dashboard/settings" 
            icon={<Settings size={18} />} 
            label="Configuration" 
            active={pathname === "/dashboard/settings"} 
          />
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-4 px-2">AI Roles</div>
          <SidebarItem 
            href="/dashboard/cto" 
            icon={<Cpu size={18} />} 
            label="AI CTO" 
            active={pathname === "/dashboard/cto"} 
          />
          <SidebarItem 
            href="/dashboard/seo" 
            icon={<Sparkles size={18} />} 
            label="AI SEO" 
            active={pathname === "/dashboard/seo"} 
          />
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500" />
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium truncate text-white">Admin User</div>
                <div className="text-xs text-muted-foreground truncate">admin@alya.ai</div>
              </div>
              <LogOut size={16} className="text-muted-foreground" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/5 bg-[#030712]/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4 text-muted-foreground group relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-white transition-colors" />
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Search or type command..." 
                 readOnly
                 className="bg-white/5 border border-white/10 rounded-full pl-10 pr-12 py-1.5 text-sm w-64 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer hover:bg-white/10 transition-colors"
                 onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-0.5 pointer-events-none">
                  <kbd className="bg-black/20 border border-white/10 rounded px-1.5 text-[10px] text-muted-foreground font-mono">⌘</kbd>
                  <kbd className="bg-black/20 border border-white/10 rounded px-1.5 text-[10px] text-muted-foreground font-mono">K</kbd>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-white">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
             </Button>
             <Link href="/dashboard/campaigns/new">
               <Button variant="premium" size="sm">Create Campaign</Button>
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-[#030712] to-[#0a0a0a]">
          {children}
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ icon, label, href, active = false }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group ${
        active 
          ? 'bg-purple-500/10 text-purple-400 shadow-[0_0_20px_-12px_rgba(168,85,247,0.5)] border border-purple-500/20' 
          : 'text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent'
      }`}
    >
      <div className={`transition-colors ${active ? 'text-purple-400' : 'group-hover:text-white'}`}>
        {icon}
      </div>
      <span>{label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
      )}
    </Link>
  )
}
