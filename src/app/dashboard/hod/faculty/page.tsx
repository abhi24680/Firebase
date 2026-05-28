
"use client"

import { useState } from "react"
import { Users, Search, UserCog, Mail, Briefcase, Activity, ShieldCheck, UserMinus, Plus } from "lucide-react"
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

export default function HODFaculty() {
  const [search, setSearch] = useState("")

  const faculty = [
    { id: "1", name: "Dr. Alan Turing", email: "turing.a@providence.edu.in", subjects: ["DSA", "Theory of Comp"], status: "ACTIVE", workload: "18 hrs/wk" },
    { id: "2", name: "Dr. Grace Hopper", email: "hopper.g@providence.edu.in", subjects: ["OS", "Compiler Design"], status: "ACTIVE", workload: "16 hrs/wk" },
    { id: "3", name: "Dr. Richard Feynman", email: "feynman.r@providence.edu.in", subjects: ["Quantum Computing"], status: "LEAVE", workload: "12 hrs/wk" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Faculty Node Management</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Manage academic personnel and institutional workload nodes.</p>
        </div>
        <Button className="bg-primary font-bold uppercase tracking-widest text-[10px] h-11 px-8">
          <Plus className="mr-2 h-4 w-4" />
          INVITE_FACULTY_NODE
        </Button>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-white/5 py-6 px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Query faculty nodes..." 
              className="pl-10 bg-secondary/50 border-white/5 uppercase font-bold text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Faculty Identity</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Academic Subjects</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Node Workload</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faculty.map((f) => (
                <TableRow key={f.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                        <UserCog className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-tight">{f.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px] uppercase opacity-60">{f.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {f.subjects.map(s => <Badge key={s} variant="outline" className="text-[8px] border-white/5 font-mono uppercase">{s}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-mono uppercase text-muted-foreground">{f.workload}</TableCell>
                  <TableCell>
                    <Badge className={f.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Activity className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10" onClick={() => toast({ title: "REVOKE_ACCESS", variant: "destructive", description: "Faculty node deactivated." })}>
                        <UserMinus className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
