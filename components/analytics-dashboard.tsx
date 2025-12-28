'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartContainer from '@/components/chart-container'
import { TrendingUp, Users, Target, MessageSquare, BarChart3, Settings, Download, RefreshCw, Filter } from 'lucide-react';

const analyticsData = [
  { name: 'Jan', visitors: 4000, conversions: 240, revenue: 2400 },
  { name: 'Feb', visitors: 3000, conversions: 139, revenue: 2210 },
  { name: 'Mar', visitors: 2000, conversions: 980, revenue: 2290 },
  { name: 'Apr', visitors: 2780, conversions: 390, revenue: 2000 },
  { name: 'May', visitors: 1890, conversions: 480, revenue: 2181 },
  { name: 'Jun', visitors: 2390, conversions: 380, revenue: 2500 },
];

const segmentData = [
  { name: 'High Value', value: 35, color: '#3b82f6' },
  { name: 'Medium Value', value: 45, color: '#10b981' },
  { name: 'Low Value', value: 20, color: '#f59e0b' },
];

const audienceData = [
  { name: 'Tech Enthusiasts', users: 2400, engagement: 85 },
  { name: 'Business Leaders', users: 1800, engagement: 92 },
  { name: 'Marketing Pros', users: 1200, engagement: 78 },
  { name: 'Developers', users: 900, engagement: 88 },
];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'segments' | 'audiences' | 'content' | 'optimization'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    const data = {
      overview: analyticsData,
      segments: segmentData,
      audiences: audienceData,
      timestamp: lastUpdated?.toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">Comprehensive insights into your platform performance</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="audiences" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Audiences
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,421</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15.9%</div>
                  <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Monthly trends and key metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Segments Distribution</CardTitle>
                  <CardDescription>Breakdown of user segments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer height={300}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={segmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label
                        >
                          {segmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Segment Performance</CardTitle>
                  <CardDescription>Conversion rates by segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer height={300}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={segmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audiences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Analytics</CardTitle>
                <CardDescription>Detailed audience insights and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.map((audience, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{audience.name}</h4>
                        <p className="text-sm text-gray-600">{audience.users.toLocaleString()} users</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{audience.engagement}%</div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${audience.engagement}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>How your content is performing across different segments</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer height={300}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to improve your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-blue-900">High Priority</h4>
                    <p className="text-blue-800 mt-1">Consider targeting the "Business Leaders" segment more aggressively - they show 92% engagement rate.</p>
                    <Button size="sm" className="mt-2">Apply Recommendation</Button>
                  </div>
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <h4 className="font-semibold text-green-900">Medium Priority</h4>
                    <p className="text-green-800 mt-1">Your conversion rate increased by 2.1% this month. Continue optimizing your landing pages.</p>
                    <Button size="sm" variant="outline" className="mt-2">View Details</Button>
                  </div>
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h4 className="font-semibold text-yellow-900">Low Priority</h4>
                    <p className="text-yellow-800 mt-1">Consider A/B testing different call-to-action buttons to improve click-through rates.</p>
                    <Button size="sm" variant="outline" className="mt-2">Start A/B Test</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
