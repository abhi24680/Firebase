
"use client"

import { useState } from "react"
import { 
  Sidebar, 
  SidebarProvider, 
  SidebarTrigger, 
  SidebarHeader,
  SidebarRail,
  SidebarFooter
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/dashboard/nav-main"
import { Input } from "@/components/ui/input"
import { Search, Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, this role would come from session/auth
  const [role, setRole] = useState<'admin' | 'hod' | 'faculty' | 'student'>('admin')

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded flex items-center justify-center font-headline font-bold text-primary-foreground text-xl">
                O
              </div>
              <span className="font-headline font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">
                OMNISYNC
              </span>
            </div>
          </SidebarHeader>
          <NavMain role={role} />
          <SidebarFooter className="border-t border-sidebar-border p-4 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">System Admin</p>
                <p className="text-xs text-muted-foreground truncate uppercase font-mono tracking-tighter">ADMIN1-ROOT</p>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 flex items-center justify-between px-8 border-b border-border bg-background/50 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-6 flex-1">
              <SidebarTrigger />
              <div className="relative w-full max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search students, roll numbers, or logs..." 
                  className="pl-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 mr-4">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Active Role:</span>
                <select 
                  className="bg-transparent text-xs font-bold text-primary uppercase cursor-pointer focus:outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="admin">Admin</option>
                  <option value="hod">HOD</option>
                  <option value="faculty">Faculty</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-accent rounded-full border-2 border-background" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 bg-background scrollbar-thin scrollbar-thumb-sidebar-border">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
