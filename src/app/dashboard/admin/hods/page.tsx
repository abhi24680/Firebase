
"use client"

import { useState } from "react"
import { UserCheck, ShieldAlert, UserPlus, UserMinus, Briefcase, Search, Filter } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminHODs() {
  const [requests, setRequests] = useState([
    { id: "req-1", name: "Dr. Sarah Connor", dept: "Cyber Security", email: "sarah.c@providence.edu.in", status: "pending" },
    { id: "req-2", name: "Dr. John Wick", dept: "AI", email: "wick.j@providence.edu.in", status: "pending" },
  ])

  const [activeHods, setActiveHods] = useState([
    { id: "hod-1", name: "Dr. Alan Turing", dept: "Computer Science", email: "turing.a@providence.edu.in" },
  ])

  const handleApprove = (reqId: string) => {
    const req = requests.find(r => r.id === reqId)
    if (req) {
      setActiveHods([...activeHods, { ...req, id: `hod-${Date.now()}` }])
      setRequests(requests.filter(r => r.id !== reqId))
      toast({
        title: "HOD_AUTHORIZED",
        description: `${req.name} has been granted administrative credentials.`,
      })
    }
  }

  const handleDecommission = (id: string) => {
    setActiveHods(activeHods.filter(h => h.id !== id))
    toast({
      variant: "destructive",
      title: "HOD_DECOMMISSIONED",
      description: "Administrative access revoked.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Administrative Node Management (HOD)</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Process HOD authorization requests and manage department leadership.</p>
        </div>
        <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all">
          <UserPlus className="mr-2 h-4 w-4" />
          DIRECT NODE ADDITION
        </Button>
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
            <div className="divide-y divide-white/5">
              {requests.map((req) => (
                <div key={req.id} className="p-6 space-y-4 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase text-foreground">{req.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono truncate">{req.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase font-mono">{req.dept}</Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive hover:bg-destructive/10 uppercase font-bold" onClick={() => setRequests(requests.filter(r => r.id !== req.id))}>Deny</Button>
                      <Button size="sm" className="h-7 text-[10px] bg-primary uppercase font-bold" onClick={() => handleApprove(req.id)}>Authorize</Button>
                    </div>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-20 text-muted-foreground text-[10px] uppercase font-mono italic opacity-50 px-6">
                  Verification queue is empty. No pending HOD nodes.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 bg-sidebar/30 border-sidebar-border">
          <CardHeader className="border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Authorized HOD Roster</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input placeholder="Search nodes..." className="pl-8 h-8 text-[10px] bg-secondary/50 border-white/5 w-[200px]" />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 border-white/5">
                  <Filter className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-white/5">
                  <TableHead className="text-[10px] uppercase font-bold pl-6">HOD Node Identity</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Academic Cluster</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Terminal Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeHods.map((hod) => (
                  <TableRow key={hod.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase tracking-tight">{hod.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{hod.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={hod.dept}>
                        <SelectTrigger className="w-[180px] h-8 text-[10px] bg-secondary/30 border-white/5 font-mono uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-sidebar-border">
                          <SelectItem value="Computer Science" className="text-[10px] uppercase font-mono">CSE</SelectItem>
                          <SelectItem value="Artificial Intelligence" className="text-[10px] uppercase font-mono">AI</SelectItem>
                          <SelectItem value="Cyber Security" className="text-[10px] uppercase font-mono">CY</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive" onClick={() => handleDecommission(hod.id)}>
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
