
"use client"

import { useState, useMemo } from "react"
import { Search, GraduationCap, Filter, ExternalLink, ShieldCheck, Database, LayoutGrid, Loader2 } from "lucide-react"
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
import { useFirestore, useCollection } from "@/firebase"
import { collection, query, where } from "firebase/firestore"

export default function AdminStudents() {
  const [search, setSearch] = useState("")
  const db = useFirestore()

  const studentsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "users"), where("role", "==", "student"))
  }, [db])

  const { data: students, loading } = useCollection(studentsQuery)

  const filtered = useMemo(() => {
    if (!students) return []
    return students.filter(s => 
      s.fullName?.toLowerCase().includes(search.toLowerCase()) || 
      s.rollNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [students, search])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Institutional Directory</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Global student registry and RFID token mapping.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all rounded-none font-bold uppercase tracking-tighter h-11 px-8">
            <Database className="mr-2 h-4 w-4" />
            EXPORT_CSV_NODE
          </Button>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="pb-0 pt-6 border-b border-white/5 bg-secondary/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 px-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, roll, or email..." 
                className="pl-10 bg-secondary/50 border-white/5 uppercase font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-white/5 bg-secondary/30 h-10 px-4 text-[10px] uppercase font-bold tracking-widest rounded-none">
                <Filter className="mr-2 h-4 w-4" />
                FILTER_ACTIVE
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-white/5">
                  <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Student Node</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Academic Cluster</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Verification Status</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Terminal Link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((student: any) => (
                  <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-110">
                          <GraduationCap className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold uppercase tracking-tight">{student.fullName}</span>
                          <span className="text-[10px] text-muted-foreground font-mono tracking-tighter uppercase opacity-50">{student.rollNumber || student.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest border-primary/10 bg-primary/5 text-primary">{student.department}</Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-mono tracking-widest border-white/5">SEM {student.semester}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        {student.isApproved ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <ShieldCheck className="h-3 w-3" />
                            <span>VERIFIED</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-500">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>PENDING</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold hover:bg-primary/10 hover:text-primary rounded-none opacity-0 group-hover:opacity-100 transition-opacity">
                        SYSTEM_PROFILE
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-mono text-[10px] uppercase opacity-50 italic">
                      No matching student nodes found in global registry.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
