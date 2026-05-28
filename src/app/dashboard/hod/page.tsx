
"use client"

import { Activity, Users, BookOpen, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function HODDashboard() {
  const deptMetrics = [
    { label: "Active Sessions", value: "8", icon: Activity, color: "text-primary" },
    { label: "Faculty Online", value: "14/18", icon: Users, color: "text-accent" },
    { label: "Total Students", value: "420", icon: BookOpen, color: "text-emerald-500" },
    { label: "Avg Attendance", value: "78%", icon: CheckCircle2, color: "text-blue-500" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Department Command</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
          Node: HOD-CSE-PRC | SESSION_ACTIVE | COMPUTER SCIENCE & ENGINEERING
        </p>
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
        <div className="xl:col-span-2 space-y-8">
          <AttendanceStats />
          
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Active Classroom Snapshots (P2Net AI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { room: "LH-301", subject: "Data Structures", rfid: 42, p2net: 45, status: "mismatch" },
                  { room: "LH-302", subject: "Operating Systems", rfid: 38, p2net: 38, status: "synced" },
                  { room: "CS-LAB-1", subject: "Networking Lab", rfid: 20, p2net: 21, status: "synced" },
                ].map((room, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-white/5">
                    <div>
                      <p className="font-bold text-sm uppercase">{room.room}: {room.subject}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">RFID: {room.rfid}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">P2NET: {room.p2net}</span>
                      </div>
                    </div>
                    <Badge className={
                      room.status === "synced" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }>
                      {room.status === "synced" ? "DATA_SYNCED" : "PROXY_DETECTED"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:col-span-1 bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Attendance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase">Critical Low Attendance</p>
                  <p className="text-[9px] text-muted-foreground font-mono">Student ID: CSE23-00{i} | Current: 62%</p>
                  <Progress value={62} className="h-1 bg-destructive/20 mt-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
