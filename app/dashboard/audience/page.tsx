"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Filter, Download, MoreHorizontal } from "lucide-react"

export default function AudiencePage() {
  const users = [
    { id: "USR-001", name: "Alice Freeman", email: "alice@example.com", segment: "VIP", status: "Active", lastActive: "2 min ago" },
    { id: "USR-002", name: "Bob Smith", email: "bob@example.com", segment: "New", status: "Active", lastActive: "5 min ago" },
    { id: "USR-003", name: "Charlie Brown", email: "charlie@example.com", segment: "At Risk", status: "Inactive", lastActive: "2 days ago" },
    { id: "USR-004", name: "Diana Prince", email: "diana@example.com", segment: "VIP", status: "Active", lastActive: "Just now" },
    { id: "USR-005", name: "Evan Wright", email: "evan@example.com", segment: "Loyal", status: "Active", lastActive: "1 hour ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Audience</h2>
          <p className="text-muted-foreground">Manage and segment your 24,350 users.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
             <Download className="w-4 h-4 mr-2" />
             Export
          </Button>
          <Button variant="premium" size="sm">
             <Filter className="w-4 h-4 mr-2" />
             Create Segment
          </Button>
        </div>
      </div>

      <Card className="bg-white/[0.02] border-white/10">
        <CardHeader>
           <CardTitle className="text-lg font-medium">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b [&_tr]:border-white/10">
                <tr className="border-b transition-colors hover:bg-white/5 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">User</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Segment</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Last Active</th>
                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 transition-colors hover:bg-white/5">
                    <td className="p-4 align-middle font-medium text-white">
                       <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
                       </div>
                    </td>
                    <td className="p-4 align-middle">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.segment === 'VIP' ? 'bg-purple-500/20 text-purple-400' :
                          user.segment === 'At Risk' ? 'bg-red-500/20 text-red-400' :
                          'bg-indigo-500/20 text-indigo-400'
                       }`}>
                          {user.segment}
                       </span>
                    </td>
                    <td className="p-4 align-middle">
                       <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`} />
                          {user.status}
                       </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{user.lastActive}</td>
                    <td className="p-4 align-middle text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
