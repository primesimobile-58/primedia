"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DemoPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    use_case: "customer_journey_optimization",
    team_size: 50,
    timeline: "3_months",
  })

  const submit = async () => {
    setLoading(true)
    setMessage("")
    const res = await fetch("/api/demo-request", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    setMessage(data.configured ? "Demo talebiniz alındı!" : "Supabase yapılandırılmadı. Lütfen env ayarlayın.")
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Request a Live Demo</h1>
        <p className="text-muted-foreground">Fill the form and we’ll schedule a personalized walkthrough.</p>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Demo Request</CardTitle>
          <CardDescription>We’ll get back within 24 hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Use Case</Label>
              <Input value={form.use_case} onChange={(e) => setForm({ ...form, use_case: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Team Size</Label>
              <Input type="number" value={form.team_size} onChange={(e) => setForm({ ...form, team_size: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Timeline</Label>
              <Input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={submit} variant="premium" disabled={loading}>{loading ? "Submitting..." : "Submit"}</Button>
          </div>
          {message && <div className="text-sm text-emerald-400">{message}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
