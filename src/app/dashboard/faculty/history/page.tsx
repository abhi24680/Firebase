"use client"

import { useState } from "react"
import { Search, GraduationCap, Calendar, Eye } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function FacultyHistory() {
  const [search, setSearch] = useState("")

  const students = [
    { id: "1", name: "Abhijith PRC", roll: "CSE23-003", subject: "Data Structures", total: 25, attended: 22 },
    { id: "2", name: "Sarah Miller", roll: "CSE23-012", subject: "Data Structures", total: 25, attended: 18 },
    { id: "3", name: "Leo Das", roll: "CSE23-045", subject: "Operating Systems", total: 20, attended: 19 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Student Attendance History</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            Past session logs and individual student attendance records.
          </p>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-white/5 py-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or roll..."
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
                <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Student</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Subject</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Attendance</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase())).map((s) => (
                <TableRow key={s.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold uppercase">{s.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{s.roll}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-white/5">{s.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-[10px] font-mono">
                      <span className={s.attended / s.total >= 0.75 ? "text-emerald-500" : "text-destructive"}>
                        {s.attended}/{s.total} ({Math.round(s.attended / s.total * 100)}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold hover:bg-primary/10">
                      <Eye className="mr-2 h-3 w-3" /> VIEW LOGS
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
