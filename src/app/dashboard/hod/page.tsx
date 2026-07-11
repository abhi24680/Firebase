
"use client"

import { useState, useEffect, useCallback } from "react"
import { Activity, Users, BookOpen, AlertTriangle, CheckCircle2, LayoutGrid, Clock, TrendingUp, Calendar, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { NotificationPanel } from "@/components/dashboard/notification-panel"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const FACULTY_NAMES = [
  "Dr. Alan Turing", "Dr. Grace Hopper", "Dr. Richard Feynman",
  "Dr. Marie Curie", "Prof. John McCarthy", "Dr. Barbara Liskov",
  "Prof. Dennis Ritchie", "Dr. Ada Lovelace",
]

const ROOMS = ["LH-301", "LH-302", "LAB-2", "LH-101", "CS-LAB-1", "LH-303", "LAB-4", "LH-201"]
const SUBJECTS = ["Data Structures", "Operating Systems", "Quantum Computing", "Thermodynamics", "Networking Lab", "Maths II", "AI Foundations", "Computer Networks"]

export default function HODDashboard() {
  const { token } = useAuth()
  const [deptMetrics, setDeptMetrics] = useState([
    { label: "Active Sessions", value: "8", icon: Activity, color: "text-primary", change: "+2" },
    { label: "Faculty Online", value: "14/18", icon: Users, color: "text-accent", change: "-1" },
    { label: "Total Students", value: "420", icon: BookOpen, color: "text-emerald-500", change: "+0" },
    { label: "Avg Attendance", value: "78%", icon: CheckCircle2, color: "text-blue-500", change: "+3%" },
  ])

  const [liveRooms, setLiveRooms] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      room: ROOMS[i],
      subject: SUBJECTS[i],
      rfid: rand(20, 55),
      p2net: rand(20, 58),
      status: Math.random() > 0.4 ? "synced" : "mismatch" as const,
    }))
  )

  const [facultyStatus, setFacultyStatus] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      name: FACULTY_NAMES[i],
      subject: SUBJECTS[i],
      room: ROOMS[i],
      status: Math.random() > 0.3 ? "Active" as const : "Offline" as const,
      workload: rand(40, 95),
    }))
  )

  const [alerts] = useState([
    { roll: "CSE23-001", percent: 62, subject: "Computer Networks" },
    { roll: "CSE23-015", percent: 55, subject: "Data Structures" },
    { roll: "CSE23-042", percent: 48, subject: "Operating Systems" },
    { roll: "CSE23-028", percent: 58, subject: "Maths II" },
    { roll: "CSE23-007", percent: 51, subject: "AI Foundations" },
  ])

  const simulateData = useCallback(() => {
    setDeptMetrics(prev => prev.map(m => {
      const val = parseInt(m.value) || 0
      const drift = rand(-2, 3)
      const newVal = Math.max(1, val + drift)
      return {
        ...m,
        value: m.label === "Faculty Online" 
          ? `${Math.min(18, Math.max(10, newVal))}/18`
          : m.label === "Avg Attendance"
          ? `${Math.min(100, Math.max(60, newVal))}%`
          : `${newVal}`,
        change: drift >= 0 ? `+${drift}` : `${drift}`,
      }
    }))

    setLiveRooms(prev => prev.map(r => {
      const rfidDrift = rand(-2, 3)
      const aiDrift = rand(-3, 4)
      const newRfid = Math.max(15, r.rfid + rfidDrift)
      const newAi = Math.max(15, r.p2net + aiDrift)
      return {
        ...r,
        rfid: newRfid,
        p2net: newAi,
        status: Math.abs(newAi - newRfid) <= 2 ? "synced" as const : "mismatch" as const,
      }
    }))

    setFacultyStatus(prev => prev.map(f => ({
      ...f,
      status: Math.random() > 0.15 ? "Active" as const : "Offline" as const,
      workload: Math.min(100, Math.max(20, f.workload + rand(-10, 10))),
    })))
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateData, 6000)
    return () => clearInterval(interval)
  }, [simulateData])

  const activeFaculty = facultyStatus.filter(f => f.status === "Active").length

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
          <Button variant="outline" size="icon" className="h-9 w-9 border-white/5" onClick={simulateData}>
            <Activity className="h-4 w-4 text-primary" />
          </Button>
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
                <Badge variant="outline" className={cn(
                  "text-[8px] font-mono uppercase",
                  metric.change.startsWith("+") ? "text-emerald-500 border-emerald-500/20" : "text-destructive border-destructive/20"
                )}>
                  {metric.change}
                </Badge>
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

        <div className="space-y-8">
          <NotificationPanel token={token} role="hod" />

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Faculty Activity</CardTitle>
                <Badge className="bg-accent/10 text-accent border-accent/20 font-mono text-[9px]">{activeFaculty} ACTIVE</Badge>
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
                    <div className="flex items-center gap-3">
                      <div className="w-16">
                        <Progress value={f.workload} className={cn("h-1", f.workload > 80 ? "bg-amber-500/20" : "bg-white/5")} />
                      </div>
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
            <CardContent className="space-y-3">
              {alerts.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase">Low Attendance Critical</p>
                    <p className="text-[9px] text-muted-foreground font-mono">
                      {a.roll} | {a.subject} | {a.percent}%
                    </p>
                    <Progress value={a.percent} className="h-1 bg-destructive/20 mt-2" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[10px] uppercase font-mono text-muted-foreground h-8">
                View All {alerts.length} Alerts →
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Today&apos;s Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">Total Sessions</span>
                  <span className="font-bold">{deptMetrics[0].value}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">Faculty Present</span>
                  <span className="font-bold">{activeFaculty}/{facultyStatus.length}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">Rooms Monitored</span>
                  <span className="font-bold">{liveRooms.length}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">Open Alerts</span>
                  <span className="font-bold text-destructive">{alerts.length}</span>
                </div>
                <div className="pt-2 flex items-center gap-2 text-[9px] font-mono text-emerald-500">
                  <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-sync every 6s
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
