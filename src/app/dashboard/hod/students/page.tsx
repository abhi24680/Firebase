
"use client"

import { useState } from "react"
import { GraduationCap, Search, Filter, ShieldCheck, Database, AlertCircle, FileText } from "lucide-react"
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
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function HODStudents() {
  const [search, setSearch] = useState("")

  const students = [
    { id: "1", name: "Abhijith PRC", roll: "CSE23-003", sem: "3", attendance: 88, compliance: "OPTIMAL" },
    { id: "2", name: "Sarah Miller", roll: "CSE23-012", sem: "3", attendance: 72, compliance: "WARNING" },
    { id: "3", name: "Leo Das", roll: "CSE23-045", sem: "3", attendance: 65, compliance: "CRITICAL" },
    { id: "4", name: "Emma Watson", roll: "CSE23-089", sem: "3", attendance: 94, compliance: "OPTIMAL" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Department Student Registry</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Global student directory and institutional compliance monitoring.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/5 font-bold uppercase text-[10px] h-11">
            <Database className="mr-2 h-4 w-4" />
            EXPORT_CENSUS
          </Button>
          <Button className="bg-primary font-bold uppercase text-[10px] h-11">
            <Filter className="mr-2 h-4 w-4" />
            GENERATE_REPORTS
          </Button>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-white/5 py-6 px-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Query student records..." 
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
                <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Student Node</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Academic Sem</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Attendance Compliance</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Compliance Node</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase tracking-tight">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase opacity-60">{s.roll}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-white/5 uppercase">SEM_{s.sem}</Badge>
                  </TableCell>
                  <TableCell className="min-w-[180px]">
                    <div className="space-y-2 max-w-[140px]">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span>{s.attendance}%</span>
                        {s.attendance < 75 && <AlertCircle className="h-3 w-3 text-destructive animate-pulse" />}
                      </div>
                      <Progress value={s.attendance} className={`h-1 bg-white/5 ${s.attendance < 75 ? 'text-destructive' : 'text-primary'}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      cn(
                        "text-[8px] uppercase font-mono",
                        s.compliance === 'OPTIMAL' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        s.compliance === 'WARNING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      )
                    }>
                      {s.compliance}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10" onClick={() => toast({ title: "REPORT_GENERATED", description: "Student history dispatched to secure node." })}>
                        <FileText className="h-4 w-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-500/10">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
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
