
"use client"

import { useState } from "react"
import { ClipboardCheck, Search, Filter, AlertTriangle, CheckCircle2, XCircle, MoreVertical, Edit2 } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function HODAttendance() {
  const [search, setSearch] = useState("")

  const logs = [
    { id: "1", student: "Abhijith PRC", roll: "CSE23-003", subject: "DSA", time: "10:45 AM", method: "RFID", status: "present" },
    { id: "2", student: "Sarah Miller", roll: "CSE23-012", subject: "OS", time: "11:32 AM", method: "P2NET", status: "present" },
    { id: "3", student: "Leo Das", roll: "CSE23-045", subject: "CN", time: "09:15 AM", method: "MANUAL", status: "absent" },
    { id: "4", student: "Emma Watson", roll: "CSE23-089", subject: "Maths", time: "02:10 PM", method: "RFID", status: "present" },
  ]

  const handleManualMark = (id: string, status: 'present' | 'absent') => {
    toast({
      title: "ATTENDANCE_OVERRIDE_SUCCESS",
      description: `Manual override: ${status.toUpperCase()} recorded for entry ${id}.`,
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Attendance Logs & Overrides</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Review global session data and manually synchronize compliance.</p>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="bg-secondary/10 border-b border-white/5 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by student, roll, or subject..." 
                className="pl-10 bg-secondary/50 border-white/5 uppercase font-bold text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest border-white/5 h-10 px-4">
                <Filter className="mr-2 h-4 w-4" />
                FILTER_DISCREPANCIES
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6 py-4">Student Node</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Subject</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Inference Method</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Timestamp</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Override</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase">{log.student}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{log.roll}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-mono border-white/5">{log.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${log.method === 'P2NET' ? 'bg-primary' : 'bg-emerald-500'}`} />
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{log.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-mono uppercase text-muted-foreground">{log.time}</TableCell>
                  <TableCell>
                    {log.status === 'present' ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] uppercase font-mono">PRESENT</Badge>
                    ) : (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] uppercase font-mono">ABSENT</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-sidebar-border">
                        <DropdownMenuItem className="text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleManualMark(log.id, 'present')}>
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                          Mark Present
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-bold uppercase cursor-pointer" onClick={() => handleManualMark(log.id, 'absent')}>
                          <XCircle className="mr-2 h-3.5 w-3.5 text-destructive" />
                          Mark Absent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
