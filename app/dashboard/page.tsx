"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Activity, Zap, Globe, Cpu, Radio, AlertCircle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion"

const data = [
  { name: '00:00', uv: 4000, pv: 2400, amt: 2400 },
  { name: '04:00', uv: 3000, pv: 1398, amt: 2210 },
  { name: '08:00', uv: 2000, pv: 9800, amt: 2290 },
  { name: '12:00', uv: 2780, pv: 3908, amt: 2000 },
  { name: '16:00', uv: 1890, pv: 4800, amt: 2181 },
  { name: '20:00', uv: 2390, pv: 3800, amt: 2500 },
  { name: '23:59', uv: 3490, pv: 4300, amt: 2100 },
];

const barData = [
  { name: 'Mon', val: 4000 },
  { name: 'Tue', val: 3000 },
  { name: 'Wed', val: 2000 },
  { name: 'Thu', val: 2780 },
  { name: 'Fri', val: 1890 },
  { name: 'Sat', val: 2390 },
  { name: 'Sun', val: 3490 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* System Status Ticker */}
      <div className="w-full h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center px-4 overflow-hidden">
         <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 animate-pulse">
            <Radio className="w-3 h-3" />
            SYSTEM OPERATIONAL
         </div>
         <div className="mx-4 text-xs text-muted-foreground/50">|</div>
         <div className="text-xs font-mono text-muted-foreground truncate flex-1">
            Predictive Engine v4.2 active • Neural Network Load: 34% • Real-time Sync: 12ms latency • New cluster provisioned in eu-central-1
         </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Mission Control</h2>
          <p className="text-muted-foreground">Orchestrating 1,204,593 active sessions across 4 regions.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400 font-medium">
              <Activity className="w-3 h-3" />
              Live
           </div>
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-muted-foreground font-medium">
              Last updated: Just now
           </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          title="Total Revenue" 
          value="$145,231.89" 
          trend="+20.1%" 
          positive
          icon={<DollarSign className="h-4 w-4 text-indigo-400" />} 
          chartData={data}
        />
        <KpiCard 
          title="Active Users" 
          value="24,350" 
          trend="+180.1%" 
          positive
          icon={<Users className="h-4 w-4 text-purple-400" />} 
          chartData={data}
        />
        <KpiCard 
          title="Conversion Rate" 
          value="3.2%" 
          trend="-4.1%" 
          positive={false}
          icon={<Zap className="h-4 w-4 text-yellow-400" />} 
          chartData={data}
        />
        <KpiCard 
          title="AI Predictions" 
          value="8.4M" 
          trend="+42%" 
          positive
          icon={<BrainIcon className="h-4 w-4 text-pink-400" />} 
          chartData={data}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        
        {/* Main Chart */}
        <Card className="col-span-4 bg-white/[0.02] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Engagement Velocity</CardTitle>
            <CardDescription>Real-time tracking of user interactions across all channels.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#0f0f16', borderColor: '#ffffff20', borderRadius: '8px' }}
                     itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
                  <Area type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Insights Panel */}
        <Card className="col-span-3 bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border-indigo-500/20 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-300">
               <SparklesIcon className="w-4 h-4" />
               Alya Intelligence Core
            </CardTitle>
            <CardDescription>Live neural processing stream.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                     <span>Anomaly Detection</span>
                     <span className="text-green-400">Stable</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "94%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-green-500 rounded-full" 
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                     <span>Predictive Modeling</span>
                     <span className="text-indigo-400">Processing</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "67%" }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="h-full bg-indigo-500 rounded-full" 
                     />
                  </div>
               </div>

               <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                  <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-xs font-mono">
                     <span className="text-indigo-400 mr-2">[14:02:41]</span> 
                     Detected high-value cohort in <span className="text-white font-bold">North America</span>. Auto-scaling initiated.
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 text-xs font-mono">
                     <span className="text-purple-400 mr-2">[14:02:38]</span> 
                     Optimizing journey path for 'Holiday Campaign'. Expected lift: <span className="text-green-400">+14%</span>.
                  </div>
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-xs font-mono opacity-60">
                     <span className="text-red-400 mr-2">[14:02:12]</span> 
                     Churn risk identified for user_id:8921. Triggering retention flow.
                  </div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Geo Map & Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <Card className="col-span-2 bg-white/[0.02] border-white/10">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Global Activity Map
               </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[200px] relative overflow-hidden">
               {/* Simplified Globe Representation */}
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-64 h-64 rounded-full border border-indigo-500/30 animate-pulse" />
                  <div className="w-48 h-48 rounded-full border border-indigo-500/50 absolute" />
                  <div className="w-32 h-32 rounded-full border border-indigo-500/70 absolute" />
               </div>
               <div className="z-10 text-center space-y-2">
                  <div className="text-4xl font-bold font-mono">24,912</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Live Connections</div>
               </div>
            </CardContent>
         </Card>
         
         <Card className="bg-white/[0.02] border-white/10">
            <CardHeader>
               <CardTitle>Platform Health</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">API Latency</span>
                     </div>
                     <span className="text-sm font-mono text-green-400">12ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Throughput</span>
                     </div>
                     <span className="text-sm font-mono text-indigo-400">45k/sec</span>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Error Rate</span>
                     </div>
                     <span className="text-sm font-mono text-green-400">0.001%</span>
                  </div>
               </div>
               
               <div className="mt-8">
                  <ResponsiveContainer width="100%" height={100}>
                     <BarChart data={barData}>
                        <Bar dataKey="val" fill="#6366f1" radius={[4, 4, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}

function KpiCard({ title, value, trend, positive, icon, chartData }: { title: string, value: string, trend: string, positive: boolean, icon: React.ReactNode, chartData: any[] }) {
  return (
    <Card className="bg-white/[0.02] border-white/10 hover:border-indigo-500/30 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
        <div className="flex items-center justify-between">
           <p className={`text-xs ${positive ? 'text-green-400' : 'text-red-400'} flex items-center`}>
             {positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
             {trend}
           </p>
           <div className="h-8 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="uv" stroke={positive ? "#4ade80" : "#f87171"} strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>
      </CardContent>
    </Card>
  )
}

function BrainIcon(props: any) {
   return (
      <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
   )
}

function SparklesIcon(props: any) {
   return (
      <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M9 17v4" />
      <path d="M3 21h4" />
    </svg>
   )
}
