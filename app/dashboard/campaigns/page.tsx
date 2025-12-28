"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, Plus, BarChart2, Calendar, Mail, Smartphone } from "lucide-react"

import Link from "next/link"

export default function CampaignsPage() {
  const campaigns = [
    { id: 1, name: "Black Friday Sale", channel: "Email", status: "Running", sent: "1.2M", openRate: "24%" },
    { id: 2, name: "Welcome Series", channel: "Multi", status: "Active", sent: "45k", openRate: "68%" },
    { id: 3, name: "Cart Abandonment", channel: "Push", status: "Paused", sent: "12k", openRate: "12%" },
  ]

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Campaigns</h2>
          <p className="text-muted-foreground">Orchestrate your messaging across all channels.</p>
        </div>
        <Link href="/dashboard/campaigns/new">
          <Button variant="premium">
             <Plus className="w-4 h-4 mr-2" />
             New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
         {campaigns.map((camp) => (
            <Card key={camp.id} className="bg-white/[0.02] border-white/10 hover:border-indigo-500/50 transition-colors cursor-pointer group">
               <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <div className="p-2 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-colors">
                        {camp.channel === 'Email' ? <Mail className="w-5 h-5 text-indigo-400" /> : <Smartphone className="w-5 h-5 text-purple-400" />}
                     </div>
                     <span className={`px-2 py-0.5 rounded text-xs border ${
                        camp.status === 'Running' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                        camp.status === 'Active' ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10' :
                        'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                     }`}>
                        {camp.status}
                     </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-indigo-300 transition-colors">{camp.name}</h3>
                  <div className="text-sm text-muted-foreground mb-4">Last edited 2 hours ago</div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                     <div>
                        <div className="text-xs text-muted-foreground">Sent</div>
                        <div className="text-lg font-mono font-medium">{camp.sent}</div>
                     </div>
                     <div>
                        <div className="text-xs text-muted-foreground">Open Rate</div>
                        <div className="text-lg font-mono font-medium">{camp.openRate}</div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
    </div>
  )
}
