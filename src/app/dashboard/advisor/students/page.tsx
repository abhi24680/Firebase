
"use client"

import { useState } from "react"
import { Search, GraduationCap, Filter, ExternalLink, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

export default function AdvisorStudents() {
  const [search, setSearch] = useState("")
  
  const students = [
    { id: "1", name: "Abhijith PRC", roll: "CSE23CA003", email: "abhijith.prc@student.p.in", attendance: 88, status: "GOOD" },
    { id: "2", name: "Sarah Miller", roll: "CSE23CA012", email: "sarah.m@student.p.in", attendance: 72, status: "WARNING" },
    { id: "3", name: "Leo Das", roll: "CSE23CA045", email: "leo.d@student.p.in", attendance: 65, status: "CRITICAL" },
    { id: "4", name: "Emma Watson", roll: "CSE23CA089", email: "emma.w@student.p.in", attendance: 92, status: "GOOD" }
  ]

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Batch Roster</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Managing: CSE 2021-25 A | Advisor: Dr. Alan Turing</p>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="pb-0 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search students..." 
                className="pl-10 bg-secondary/50 border-white/5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/5 bg-secondary/30 h-10 px-4 text-[10px] uppercase font-bold tracking-widest">
              <Filter className="mr-2 h-4 w-4" />
              STATUS_FILTER
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6">Student Identity</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Attendance Health</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase">{student.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{student.roll}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono">{student.attendance}%</span>
                        {student.attendance < 75 && (
                          <AlertTriangle className="h-3 w-3 text-destructive animate-pulse" />
                        )}
                      </div>
                      <Progress value={student.attendance} className={`h-1 bg-white/5 ${student.attendance < 75 ? 'text-destructive' : 'text-primary'}`} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold hover:bg-primary/10">
                      PROFILE
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
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
