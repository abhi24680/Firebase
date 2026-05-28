
"use client"

import { useState, useEffect } from "react"
import { Activity, Users, BookOpen, Clock, AlertTriangle, CheckCircle2, UserCheck, Search, LayoutGrid } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function HODDashboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const deptMetrics = [
    { label: "Active Sessions", value: "8", icon: Activity, color: "text-primary" },
    { label: "Faculty Online", value: "14/18", icon: Users, color: "text-accent" },
    { label: "Total Students", value: "420", icon: BookOpen, color: "text-emerald-500" },
    { label: "Avg Attendance", value: "78%", icon: CheckCircle2, color: "text-blue-500" },
  ]

  const facultyStatus = [
    { name: "Dr. Alan Turing", subject: "Data Structures", room: "LH-301", status: "Active" },
    { name: "Dr. Grace Hopper", subject: "Operating Systems", room: "LH-302", status: "Active" },
    { name: "Dr. Richard Feynman", subject: "Quantum Computing", room: "LAB-2", status: "Offline" },
    { name: "Dr. Marie Curie", subject: "Thermodynamics", room: "LH-101", status: "Active" },
  ]

  const liveRooms = [
    { room: "LH-301", subject: "Data Structures", rfid: 42, p2net: 45, status: "mismatch" },
    { room: "LH-302", subject: "Operating Systems", rfid: 38, p2net: 38, status: "synced" },
    { room: "CS-LAB-1", subject: "Networking Lab", rfid: 20, p2net: 21, status: "synced" },
    { room: "LH-101", subject: "Maths II", rfid: 55, p2net: 60, status: "mismatch" },
  ]

  if (!mounted) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Department Command Center</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            NODE: HOD-CSE-PRC | INSTITUTIONAL MONITORING | COMPUTER SCIENCE
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
            SYNC_STABLE
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono">
            SEM_III_ACTIVE
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deptMetrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                <p className="text-2xl font-headline font-bold">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column: Stats and Live Monitoring */}
        <div className="xl:col-span-2 space-y-8">
          <AttendanceStats />
          
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Live Room Monitoring (P2Net AI)</CardTitle>
              </div>
              <Badge variant="outline" className="text-[8px] font-mono border-emerald-500/20 text-emerald-500 animate-pulse">LIVE_INFERENCE</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveRooms.map((room, i) => (
                  <div key={i} className="flex flex-col p-4 bg-secondary/30 rounded-lg border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm uppercase">{room.room}</span>
                      <Badge className={cn(
                        "text-[9px] uppercase font-mono",
                        room.status === "synced" 
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {room.status === "synced" ? "SYNCED" : "MISMATCH"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase font-mono truncate">{room.subject}</p>
                    <div className="flex justify-between items-end">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-muted-foreground uppercase font-mono">RFID</span>
                          <span className="text-lg font-headline font-bold">{room.rfid}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] text-muted-foreground uppercase font-mono text-primary">AI Count</span>
                          <span className="text-lg font-headline font-bold text-primary">{room.p2net}</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">
                        {Math.abs(room.rfid - room.p2net) > 0 && (
                          <span className="text-amber-500">+{Math.abs(room.rfid - room.p2net)} Unverified</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Faculty Status and Alerts */}
        <div className="space-y-8">
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Faculty Activity</CardTitle>
                <Badge className="bg-accent/10 text-accent border-accent/20 font-mono text-[9px]">14 ACTIVE</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {facultyStatus.map((f, i) => (
                  <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        f.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-muted"
                      )} />
                      <div>
                        <p className="text-xs font-bold uppercase">{f.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono uppercase">{f.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[8px] border-white/5 font-mono">{f.room}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-destructive">Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase">Low Attendance Critical</p>
                    <p className="text-[9px] text-muted-foreground font-mono">Roll No: CSE23-00{i} | Current: {60 + i}%</p>
                    <Progress value={60 + i} className="h-1 bg-destructive/20 mt-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
