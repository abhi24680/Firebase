
"use client"

import { useState } from "react"
import { Search, GraduationCap, Filter, ExternalLink } from "lucide-react"
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

export default function AdminStudents() {
  const [search, setSearch] = useState("")
  
  const students = [
    { 
      id: "1", 
      name: "Abhijith PRC", 
      roll: "CSE23CA003", 
      email: "abhijith.prc23ca003@student.providence.edu.in", 
      dept: "CSE", 
      sem: "3", 
      status: "ACTIVE" 
    },
    { 
      id: "2", 
      name: "Sarah Miller", 
      roll: "AI24CA012", 
      email: "sarah.m24ca012@student.providence.edu.in", 
      dept: "AI", 
      sem: "1", 
      status: "ACTIVE" 
    },
    { 
      id: "3", 
      name: "Leo Das", 
      roll: "CY22CA045", 
      email: "leo.d22ca045@student.providence.edu.in", 
      dept: "CY", 
      sem: "5", 
      status: "LEAVE" 
    },
    { 
      id: "4", 
      name: "Emma Watson", 
      roll: "ECE21CA089", 
      email: "emma.w21ca089@student.providence.edu.in", 
      dept: "ECE", 
      sem: "7", 
      status: "ACTIVE" 
    }
  ]

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Student Directory</h1>
        <p className="text-muted-foreground">Global view of all registered student nodes across departments.</p>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="pb-0 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or roll number..." 
                className="pl-10 bg-secondary/50 border-white/5"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-white/5 bg-secondary/30 h-10 px-4 text-[10px] uppercase font-bold tracking-widest">
                <Filter className="mr-2 h-4 w-4" />
                FILTER NODES
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6">Student Node</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Academic Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">RFID Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Log Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase">{student.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{student.roll}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tighter border-white/5">{student.dept}</Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-tighter border-white/5">SEM {student.sem}</Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[200px] font-mono">{student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      student.status === "ACTIVE" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px]"
                    }>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold hover:bg-primary/10 hover:text-primary">
                      FULL PROFILE
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
