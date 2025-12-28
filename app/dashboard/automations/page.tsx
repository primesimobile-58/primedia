"use client"

import { Button } from "@/components/ui/button"
import { GitBranch, Plus, Zap, Clock } from "lucide-react"

export default function AutomationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Automations</h2>
          <p className="text-muted-foreground">Build always-on journeys for your customers.</p>
        </div>
        <Button variant="premium">
           <Plus className="w-4 h-4 mr-2" />
           Create Journey
        </Button>
      </div>

      <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.01] p-12 text-center">
         <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <GitBranch className="w-8 h-8 text-muted-foreground" />
         </div>
         <h3 className="text-xl font-semibold mb-2">No active journeys</h3>
         <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            Start automating your customer experience. Create a journey to engage users based on their behavior.
         </p>
         <Button variant="outline">Browse Templates</Button>
      </div>
    </div>
  )
}
