"use client"

import { useState, useEffect, useMemo } from "react"
import { ShieldAlert, UserMinus, ShieldCheck, Mail, Building2, Search, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

interface HOD {
  id: string
  fullName: string
  email: string
  department: string
  isApproved: boolean
}

export default function AdminHODs() {
  const [search, setSearch] = useState("")
  const [hods, setHods] = useState<HOD[]>([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/users?role=hod', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        if (!cancelled) setHods(data.users)
      } catch {
        if (!cancelled) setHods([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [token])

  const handleApprove = async (hodId: string) => {
    if (!token) return

    try {
      const res = await fetch(`/api/users/${hodId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: true }),
      })
      if (!res.ok) throw new Error('Approval failed')
      const data = await res.json()
      setHods(prev => prev.map(h => h.id === hodId ? { ...h, ...data.user } : h))
      toast({
        title: "HOD_AUTHORIZED",
        description: "Administrative credentials granted to node.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "APPROVAL_FAILED",
        description: "Could not authorize HOD node.",
      })
    }
  }

  const handleDecommission = async (hodId: string) => {
    if (!token) return

    try {
      const res = await fetch(`/api/users/${hodId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isApproved: false }),
      })
      if (!res.ok) throw new Error('Decommission failed')
      const data = await res.json()
      setHods(prev => prev.map(h => h.id === hodId ? { ...h, ...data.user } : h))
      toast({
        variant: "destructive",
        title: "HOD_DECOMMISSIONED",
        description: "Administrative access revoked.",
      })
    } catch {
      toast({
        variant: "destructive",
        title: "DECOMMISSION_FAILED",
        description: "Could not decommission HOD node.",
      })
    }
  }

  const requests = useMemo(() => hods.filter(h => !h.isApproved), [hods])
  const activeHods = useMemo(() => hods.filter(h => h.isApproved), [hods])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Admin Node Management</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Process HOD authorization requests and manage department leadership.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-1 bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="bg-amber-500/5 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Verification Queue</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-amber-500 border-amber-500/20">
                {requests.length} PENDING
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              <div className="divide-y divide-white/5">
                {requests.map((req) => (
                  <div key={req.id} className="p-6 space-y-4 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm uppercase text-foreground">{req.fullName}</span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                        <Mail className="h-3 w-3" /> {req.email}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-mono">
                        <Building2 className="h-3 w-3 mr-1" /> {req.department}
                      </Badge>
                      <Button size="sm" className="h-7 text-[10px] bg-primary uppercase font-bold" onClick={() => handleApprove(req.id)}>Authorize</Button>
                    </div>
                  </div>
                ))}
                {requests.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground text-[10px] uppercase font-mono italic opacity-50 px-6">
                    Verification queue is empty.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Authorized HOD Roster</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input 
                    placeholder="Query nodes..." 
                    className="pl-8 h-8 text-[10px] bg-secondary/50 border-white/5 w-[200px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow className="border-white/5">
                    <TableHead className="text-[10px] uppercase font-bold pl-6">HOD Node Identity</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold">Academic Cluster</TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Management</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeHods.filter(h => h.fullName?.toLowerCase().includes(search.toLowerCase())).map((hod) => (
                    <TableRow key={hod.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold uppercase tracking-tight">{hod.fullName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono uppercase opacity-50 tracking-tighter">{hod.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] bg-secondary border-white/5 uppercase font-mono">
                          {hod.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive" onClick={() => handleDecommission(hod.id)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {activeHods.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-20 text-muted-foreground font-mono text-[10px] uppercase italic opacity-50">
                        No active HOD nodes synchronized.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
