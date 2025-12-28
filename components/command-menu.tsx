"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, Calculator, User, CreditCard, Settings, Calendar, Smile, LayoutDashboard, Zap, MessageSquare, BarChart3, Users, Globe2, Cpu, Sparkles } from "lucide-react"

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-2"
    >
      <Dialog.Title className="sr-only">Global Command Menu</Dialog.Title>
      <div className="flex items-center border-b border-white/10 px-3" cmdk-input-wrapper="">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-white" />
        <Command.Input 
          placeholder="Type a command or search..." 
          className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-white"
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
        
        <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 mb-2">
          <Command.Item 
            onSelect={() => runCommand(() => router.push('/dashboard'))}
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Overview</span>
          </Command.Item>
          <Command.Item 
            onSelect={() => runCommand(() => router.push('/dashboard/audience'))}
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Audience</span>
          </Command.Item>
          <Command.Item 
            onSelect={() => runCommand(() => router.push('/dashboard/campaigns'))}
            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Campaigns</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/automations'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Zap className="mr-2 h-4 w-4" />
            <span>Automations</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/analytics'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/engines'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Globe2 className="mr-2 h-4 w-4" />
            <span>Engines</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/settings'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/cto'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Cpu className="mr-2 h-4 w-4" />
            <span>AI CTO</span>
          </Command.Item>
          <Command.Item 
             onSelect={() => runCommand(() => router.push('/dashboard/seo'))}
             className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI SEO</span>
          </Command.Item>
        </Command.Group>
        
        <Command.Separator className="my-1 h-px bg-white/10" />
        
        <Command.Group heading="Suggestions" className="text-xs font-medium text-muted-foreground px-2 mb-2">
          <Command.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Calendar</span>
          </Command.Item>
          <Command.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300">
            <Smile className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </Command.Item>
          <Command.Item className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-300">
            <Calculator className="mr-2 h-4 w-4" />
            <span>Calculator</span>
          </Command.Item>
        </Command.Group>
      </Command.List>
      
      <div className="border-t border-white/10 py-2 px-3 text-[10px] text-muted-foreground flex items-center justify-between">
         <span>Pro Tip: Use arrow keys to navigate</span>
         <div className="flex items-center gap-1">
            <span className="bg-white/10 px-1 rounded">esc</span> to close
         </div>
      </div>
    </Command.Dialog>
  )
}
