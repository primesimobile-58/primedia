"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

// Mock Data
const performanceData = [
  { name: 'Mon', revenue: 4000, users: 2400, sessions: 2400 },
  { name: 'Tue', revenue: 3000, users: 1398, sessions: 2210 },
  { name: 'Wed', revenue: 2000, users: 9800, sessions: 2290 },
  { name: 'Thu', revenue: 2780, users: 3908, sessions: 2000 },
  { name: 'Fri', revenue: 1890, users: 4800, sessions: 2181 },
  { name: 'Sat', revenue: 2390, users: 3800, sessions: 2500 },
  { name: 'Sun', revenue: 3490, users: 4300, sessions: 2100 },
];

const channelData = [
  { name: 'Email', value: 45 },
  { name: 'Social', value: 30 },
  { name: 'Direct', value: 15 },
  { name: 'Organic', value: 10 },
];

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    description: "vs last month"
  },
  {
    title: "Active Users",
    value: "+2350",
    change: "+180.1%",
    trend: "up",
    description: "vs last month"
  },
  {
    title: "Bounce Rate",
    value: "12.23%",
    change: "-4.5%",
    trend: "down", // good for bounce rate
    description: "vs last month"
  },
  {
    title: "Avg. Session",
    value: "4m 32s",
    change: "+12.3%",
    trend: "up",
    description: "vs last month"
  }
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white glow-text">Analytics</h2>
          <p className="text-muted-foreground">
            Deep dive into your performance metrics and ROI analysis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="glass-card">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="premium">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card hover:bg-white/5 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={metric.trend === 'up' || metric.title === 'Bounce Rate' ? "text-emerald-500" : "text-rose-500"}>
                    {metric.change}
                  </span>{" "}
                  {metric.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4 glass-card">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue performance across all channels</CardDescription>
          </CardHeader>
          <CardContent className="pl-2" style={{ minWidth: 0 }}>
            <div className="h-[350px] w-full" style={{ minWidth: 0 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg bg-white/5 animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="lg:col-span-3 glass-card">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Distribution by acquisition channel</CardDescription>
          </CardHeader>
          <CardContent style={{ minWidth: 0 }}>
            <div className="h-[350px] w-full flex items-center justify-center" style={{ minWidth: 0 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg bg-white/5 animate-pulse" />
              )}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {channelData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Weekly user engagement metrics</CardDescription>
          </CardHeader>
          <CardContent style={{ minWidth: 0 }}>
            <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg bg-white/5 animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>AI Performance Score</CardTitle>
            <CardDescription>Predictive analysis accuracy trends</CardDescription>
          </CardHeader>
          <CardContent style={{ minWidth: 0 }}>
            <div className="h-[300px] w-full flex flex-col items-center justify-center relative" style={{ minWidth: 0 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="text-center">
                    <div className="text-5xl font-bold text-white mb-2">98.5%</div>
                    <div className="text-sm text-emerald-500 flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +2.4% Improvement
                    </div>
                 </div>
              </div>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 98.5 }, { value: 1.5 }]}
                      cx="50%"
                      cy="50%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#8b5cf6" />
                      <Cell fill="rgba(255,255,255,0.1)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full w-full rounded-lg bg-white/5 animate-pulse" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
