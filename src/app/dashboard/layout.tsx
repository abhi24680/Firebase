
"use client"

import { useState, useEffect } from "react"
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
import { Search, Bell, Settings, User, LogOut, ShieldAlert, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo state - in production this comes from useUser()
  const [role, setRole] = useState<'admin' | 'hod' | 'faculty' | 'student' | 'advisor'>('admin')
  const [isApproved, setIsApproved] = useState(true)
  const router = useRouter()

  const handleRoleChange = (newRole: string) => {
    const r = newRole as any
    setRole(r)
    // For demo: non-students registration needs approval
    setIsApproved(r === 'student' || r === 'admin') 
    const route = r === 'admin' ? 'admin' : r
    router.push(`/dashboard/${route}`)
  }

  // If not approved, show the pending screen instead of sidebar layout
  if (!isApproved) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <ShieldAlert className="h-12 w-12 text-amber-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold">Access Restricted</h2>
            <p className="text-muted-foreground">
              Your <span className="text-primary font-bold uppercase">{role}</span> node is currently awaiting manual approval.
            </p>
          </div>
          <div className="p-4 bg-secondary/30 border border-sidebar-border rounded-lg text-sm text-left font-mono">
            <p className="text-muted-foreground uppercase text-[10px] mb-2 tracking-widest">System Status:</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span>PENDING_VALIDATION_NODE_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              RETURN TO LOGIN
            </Link>
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
            Contact your department HOD or system administrator to expedite the verification process.
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border">
            <Logo size="md" className="group-data-[collapsible=icon]:hidden" />
            <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
              <Logo size="sm" iconOnly />
            </div>
          </SidebarHeader>
          <NavMain role={role} />
          <SidebarFooter className="border-t border-sidebar-border p-4 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/20">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate uppercase">Active Node</p>
                <p className="text-xs text-muted-foreground truncate uppercase font-mono tracking-tighter">
                  {role}-NODE-01
                </p>
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
                  placeholder="Query system logs or students..." 
                  className="pl-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 mr-4">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Auth Level:</span>
                <select 
                  className="bg-transparent text-xs font-bold text-primary uppercase cursor-pointer focus:outline-none"
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="hod">HOD</option>
                  <option value="advisor">Advisor</option>
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
