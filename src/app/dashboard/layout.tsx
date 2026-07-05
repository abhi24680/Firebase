
"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Search, Bell, Settings, User, ShieldAlert, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useUser, useDoc, useFirestore } from "@/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { errorEmitter } from '@/firebase/error-emitter'
import { FirestorePermissionError } from '@/firebase/errors'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const firestore = useFirestore()
  const { user, loading: userLoading } = useUser()
  
  const userDocRef = useMemo(() => {
    if (!firestore || !user?.uid) return null
    return doc(firestore, "users", user.uid)
  }, [firestore, user?.uid])

  const { data: profile, loading: profileLoading } = useDoc(userDocRef)

  const [isSimulatingApproval, setIsSimulatingApproval] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const role = profile?.role || 'student'
  const isApproved = profile?.isApproved || role === 'admin'

  const simulateApproval = () => {
    if (!userDocRef) return
    setIsSimulatingApproval(true)
    
    updateDoc(userDocRef, { isApproved: true })
      .then(() => {
        setIsSimulatingApproval(false)
        const approver = role === 'hod' ? 'System Administrator' : 'Head of Department'
        toast({
          title: "ACCESS_GRANTED",
          description: `${approver} has authorized your node credentials.`,
        })
      })
      .catch(async (error: any) => {
        setIsSimulatingApproval(false)
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: { isApproved: true },
        });
        errorEmitter.emit('permission-error', permissionError);
      })
  }

  if (!mounted || userLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (!isApproved) {
    const approverName = role === 'hod' ? 'System Administrator' : 'Head of Department (HOD)'
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px]" />
        
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <ShieldAlert className="h-12 w-12 text-amber-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold uppercase tracking-tighter">Node Approval Required</h2>
            <p className="text-muted-foreground">
              Your <span className="text-primary font-bold uppercase">{role}</span> node is currently awaiting manual authorization from the <span className="text-white font-bold">{approverName}</span>.
            </p>
          </div>
          <div className="p-4 bg-secondary/30 border border-sidebar-border rounded-lg text-sm text-left font-mono">
            <p className="text-muted-foreground uppercase text-[10px] mb-2 tracking-widest">System Metadata:</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="truncate">NODE_ID: {user.uid.substring(0, 8).toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-2 w-2 rounded-full bg-muted" />
              <span>STATUS: PENDING_{role === 'hod' ? 'ADMIN' : 'HOD'}_SIGNATURE</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-primary font-bold uppercase tracking-tighter" 
              onClick={simulateApproval}
              disabled={isSimulatingApproval}
            >
              {isSimulatingApproval ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Simulate {role === 'hod' ? 'Admin' : 'HOD'} Approval
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full border-white/5 hover:bg-white/5" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Terminal
              </Link>
            </Button>
          </div>
          
          <p className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-50">
            Institutional verification is required for all administrative and faculty nodes.
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
          <NavMain role={role as any} />
          <SidebarFooter className="border-t border-sidebar-border p-4 group-data-[collapsible=icon]:hidden">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate uppercase">{profile?.fullName || 'Verified Node'}</p>
                <p className="text-xs text-muted-foreground truncate uppercase font-mono tracking-tighter">
                  {role}-NODE-PRC
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
