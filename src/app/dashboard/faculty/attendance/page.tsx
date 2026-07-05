
"use client"

import { useState } from "react"
import { Search, UserCheck, UserX, Filter, Save, FileSpreadsheet, Download, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
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

export default function FacultyQuickAttendance() {
  const [search, setSearch] = useState("")
  const [students, setStudents] = useState([
    { id: "1", name: "Abhijith PRC", roll: "CSE23-003", status: "pending", attendance: 88 },
    { id: "2", name: "Sarah Miller", roll: "CSE23-012", status: "present", attendance: 72 },
    { id: "3", name: "Leo Das", roll: "CSE23-045", status: "absent", attendance: 65 },
    { id: "4", name: "Emma Watson", roll: "CSE23-089", status: "present", attendance: 94 },
    { id: "5", name: "Michael Corleone", roll: "CSE23-015", status: "pending", attendance: 82 },
    { id: "6", name: "Don Draper", roll: "CSE23-022", status: "pending", attendance: 90 },
  ])

  const toggleStatus = (id: string, newStatus: 'present' | 'absent' | 'pending') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
  }

  const handleBulkSubmit = () => {
    toast({
      title: "BATCH_SYNC_SUCCESS",
      description: "Attendance records synchronized with master node.",
    })
  }

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.roll.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Quick Roster Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Bulk manual marking for current active batch.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-11 border-white/5 font-bold uppercase text-[10px]">
            <Download className="mr-2 h-4 w-4" />
            EXPORT_ROSTER_CSV
          </Button>
          <Button className="h-11 bg-primary font-bold uppercase text-[10px]" onClick={handleBulkSubmit}>
            <Save className="mr-2 h-4 w-4" />
            COMMIT_GLOBAL_SYNC
          </Button>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-white/5 py-6 px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Query roster..." 
                className="pl-10 bg-secondary/50 border-white/5 uppercase font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Present: {students.filter(s => s.status === 'present').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Absent: {students.filter(s => s.status === 'absent').length}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Student Node</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-center">Semester Health</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Quick Mark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono uppercase">{s.roll}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      "text-[10px] font-mono border-white/5",
                      s.attendance < 75 ? "text-destructive" : "text-primary"
                    )}>
                      {s.attendance}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant={s.status === 'present' ? 'default' : 'outline'} 
                        className={cn(
                          "h-8 text-[10px] uppercase font-bold px-3",
                          s.status === 'present' ? "bg-emerald-500 hover:bg-emerald-600" : "border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                        )}
                        onClick={() => toggleStatus(s.id, 'present')}
                      >
                        <UserCheck className="mr-1.5 h-3 w-3" />
                        Present
                      </Button>
                      <Button 
                        size="sm" 
                        variant={s.status === 'absent' ? 'destructive' : 'outline'} 
                        className={cn(
                          "h-8 text-[10px] uppercase font-bold px-3",
                          s.status === 'absent' ? "" : "border-destructive/20 text-destructive hover:bg-destructive/10"
                        )}
                        onClick={() => toggleStatus(s.id, 'absent')}
                      >
                        <UserX className="mr-1.5 h-3 w-3" />
                        Absent
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-muted-foreground hover:bg-white/10"
                        onClick={() => toggleStatus(s.id, 'pending')}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
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
