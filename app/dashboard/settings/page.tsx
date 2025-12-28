"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Bell, Key, Save, Shield, Globe, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "api", label: "API Keys", icon: Key },
  { id: "youtube", label: "YouTube", icon: Video },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [health, setHealth] = useState<any>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [ytConnected, setYtConnected] = useState<boolean | null>(null);
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [redirectUri, setRedirectUri] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [secretStatus, setSecretStatus] = useState<any>(null)
  const base = process.env.NEXT_PUBLIC_AUTOMATION_BASE_URL || ""
  const [channelId, setChannelId] = useState("")
  const [userId, setUserId] = useState("")
  const [channelStatus, setChannelStatus] = useState<any>(null)

  useEffect(() => {
    const loadHealth = async () => {
      try {
        const res = await fetch('/api/health')
        const json = await res.json()
        setHealth(json)
      } finally {
        setHealthLoading(false)
      }
    }
    loadHealth()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white glow-text">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:w-64 flex-shrink-0">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all",
                    activeTab === tab.id
                      ? "bg-purple-500/20 text-purple-400 shadow-[0_0_20px_-12px_rgba(168,85,247,0.5)]"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your public profile information.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" placeholder="Alya" defaultValue="Alya" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" placeholder="AI" defaultValue="User" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="user@alya.ai" defaultValue="demo@alya.ai" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" placeholder="Tell us about yourself" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="premium">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "account" && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>Manage your password and security settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current">Current Password</Label>
                      <Input id="current" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input id="new" type="password" />
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="text-lg font-semibold mb-2">Environment</div>
                      {healthLoading ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                      ) : (
                        <ul className="text-sm">
                          <li>Supabase URL: {health?.env?.supabaseUrl ? 'OK' : 'Missing'}</li>
                          <li>Supabase Anon: {health?.env?.supabaseAnon ? 'OK' : 'Missing'}</li>
                          <li>Supabase Service: {health?.env?.supabaseService ? 'OK' : 'Missing'}</li>
                        </ul>
                      )}
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="text-lg font-semibold mb-2">Auth Providers</div>
                      {healthLoading ? (
                        <div className="text-sm text-muted-foreground">Loading…</div>
                      ) : (
                        <ul className="text-sm">
                          <li>Google: {health?.providers?.googleEnabled ? 'Enabled' : 'Disabled'}</li>
                          <li>Apple: {health?.providers?.appleEnabled ? 'Enabled' : 'Disabled'}</li>
                        </ul>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                     <Button variant="outline" className="mr-2">Cancel</Button>
                     <Button variant="premium">Update Password</Button>
                  </CardFooter>
                </Card>

                 <Card className="glass-card border-rose-500/20">
                  <CardHeader>
                    <CardTitle className="text-rose-400">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
                  </CardContent>
                  <CardFooter>
                     <Button variant="destructive" className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20 border">Delete Account</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <h4 className="font-medium text-white">Campaign Alerts</h4>
                          <p className="text-sm text-muted-foreground">Receive emails about your campaign performance.</p>
                       </div>
                       <div className="h-6 w-11 rounded-full bg-purple-600 relative cursor-pointer">
                          <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <h4 className="font-medium text-white">Security Alerts</h4>
                          <p className="text-sm text-muted-foreground">Receive alerts about suspicious activity.</p>
                       </div>
                       <div className="h-6 w-11 rounded-full bg-white/10 relative cursor-pointer">
                          <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-6">
                 <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for external access.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-black/40 border border-white/10 flex items-center justify-between">
                       <div className="font-mono text-sm text-muted-foreground">sk_live_51Mz...892d</div>
                       <Button size="sm" variant="ghost">Copy</Button>
                    </div>
                    <Button variant="premium">
                       <Key className="w-4 h-4 mr-2" />
                       Generate New Key
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "youtube" && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>YouTube Connect</CardTitle>
                    <CardDescription>Authorize channel for uploads and analytics.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="w-4 h-4 text-red-400" />
                      <span>Status: {ytConnected === null ? "-" : ytConnected ? "Connected" : "Not Connected"}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Client ID</Label>
                        <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="GOOGLE_CLIENT_ID" />
                      </div>
                      <div>
                        <Label>Client Secret</Label>
                        <Input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="GOOGLE_CLIENT_SECRET" />
                      </div>
                      <div>
                        <Label>Redirect URI</Label>
                        <Input value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} placeholder="https://yourapp.com/api/youtube/oauth/callback" />
                      </div>
                      <div>
                        <Label>YouTube API Key</Label>
                        <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="YOUTUBE_API_KEY" />
                      </div>
                      <div>
                        <Label>Channel ID</Label>
                        <Input value={channelId} onChange={(e) => setChannelId(e.target.value)} placeholder="UCxxxxxxxxxxxxxxxx" />
                      </div>
                      <div>
                        <Label>User ID</Label>
                        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="ot6ya_3vV-PEAcZawKrN3w" />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Saved: {secretStatus ? JSON.stringify(secretStatus.status) : "-"}</div>
                    <div className="text-xs text-muted-foreground">Channel: {channelStatus ? `${channelStatus.status.title} • subs ${channelStatus.status.subs} • videos ${channelStatus.status.videos}` : "-"}</div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="premium" onClick={async () => {
                      const res = await fetch(`${base}/api/youtube/oauth/start`)
                      const data = await res.json()
                      window.location.href = data.url
                    }}>Connect Channel</Button>
                    <Button variant="outline" onClick={async () => {
                      const res = await fetch(`${base}/api/youtube/status`)
                      const data = await res.json()
                      setYtConnected(Boolean(data.connected))
                    }}>Refresh Status</Button>
                    <Button variant="outline" onClick={async () => {
                      await fetch(`${base}/api/admin/secrets/set`, {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ youtube: { clientId, clientSecret, redirectUri, apiKey, channelId, userId } }),
                      })
                      const res2 = await fetch(`${base}/api/admin/secrets/status`)
                      const st = await res2.json()
                      setSecretStatus(st)
                    }}>Save Secrets</Button>
                    <Button variant="ghost" onClick={async () => {
                      const res2 = await fetch(`${base}/api/admin/secrets/status`)
                      const st = await res2.json()
                      setSecretStatus(st)
                    }}>Refresh Secrets</Button>
                    <Button variant="ghost" onClick={async () => {
                      const res = await fetch(`${base}/api/youtube/channel/status?channelId=${encodeURIComponent(channelId)}`)
                      const st = await res.json()
                      setChannelStatus(st)
                    }}>Refresh Channel</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
