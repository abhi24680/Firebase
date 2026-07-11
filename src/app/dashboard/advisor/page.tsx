
"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, GraduationCap, ClipboardCheck, MessageSquare, TrendingUp, Calendar, Send, AlertTriangle, CheckCircle2, Clock, UserPlus, BookOpen, BarChart3, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { NotificationPanel } from "@/components/dashboard/notification-panel"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const STUDENTS = [
  { name: "Alice Johnson", roll: "CSE21-001", attendance: 85, status: "good" as const, subjects: { DSA: 88, CN: 82, OS: 85, Maths: 78 } },
  { name: "Bob Smith", roll: "CSE21-002", attendance: 72, status: "warning" as const, subjects: { DSA: 70, CN: 65, OS: 76, Maths: 80 } },
  { name: "Carol White", roll: "CSE21-003", attendance: 91, status: "good" as const, subjects: { DSA: 94, CN: 88, OS: 90, Maths: 92 } },
  { name: "David Brown", roll: "CSE21-004", attendance: 58, status: "critical" as const, subjects: { DSA: 55, CN: 50, OS: 62, Maths: 68 } },
  { name: "Eve Davis", roll: "CSE21-005", attendance: 79, status: "good" as const, subjects: { DSA: 82, CN: 76, OS: 80, Maths: 74 } },
  { name: "Frank Miller", roll: "CSE21-006", attendance: 64, status: "warning" as const, subjects: { DSA: 60, CN: 58, OS: 68, Maths: 72 } },
  { name: "Grace Wilson", roll: "CSE21-007", attendance: 95, status: "good" as const, subjects: { DSA: 96, CN: 92, OS: 94, Maths: 98 } },
  { name: "Henry Taylor", roll: "CSE21-008", attendance: 67, status: "warning" as const, subjects: { DSA: 65, CN: 62, OS: 70, Maths: 68 } },
]

const LEAVE_REQUESTS: { name: string; roll: string; from: string; to: string; reason: string; status: "pending" | "approved" | "rejected" }[] = [
  { name: "Alice Johnson", roll: "CSE21-001", from: "2024-11-05", to: "2024-11-06", reason: "Medical appointment", status: "pending" },
  { name: "Frank Miller", roll: "CSE21-006", from: "2024-11-08", to: "2024-11-08", reason: "Family function", status: "pending" },
  { name: "David Brown", roll: "CSE21-004", from: "2024-11-10", to: "2024-11-12", reason: "Personal reasons", status: "pending" },
]

export default function AdvisorDashboard() {
  const { token } = useAuth()
  const [metrics, setMetrics] = useState([
    { label: "Total Students", value: "64", icon: Users, color: "text-blue-500", change: "+2" },
    { label: "Avg Attendance", value: "82%", icon: ClipboardCheck, color: "text-emerald-500", change: "+1%" },
    { label: "Low Attendance", value: "5", icon: TrendingUp, color: "text-amber-500", change: "-1" },
    { label: "New Alerts", value: "12", icon: MessageSquare, color: "text-accent", change: "+3" },
  ])

  const [students, setStudents] = useState(STUDENTS)
  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS)
  const [pendingLeaves, setPendingLeaves] = useState(LEAVE_REQUESTS.length)

  const simulateData = useCallback(() => {
    setMetrics(prev => prev.map(m => {
      const val = parseInt(m.value) || 0
      const drift = rand(-2, 3)
      const newVal = Math.max(1, val + drift)
      return {
        ...m,
        value: m.label === "Avg Attendance" ? `${Math.min(100, Math.max(65, newVal))}%` : `${newVal}`,
        change: drift >= 0 ? `+${drift}` : `${drift}`,
      }
    }))

    setStudents(prev => prev.map(s => {
      const drift = rand(-3, 4)
      const newAtt = Math.max(40, Math.min(100, s.attendance + drift))
      return {
        ...s,
        attendance: newAtt,
        status: newAtt < 60 ? "critical" as const : newAtt < 75 ? "warning" as const : "good" as const,
        subjects: Object.fromEntries(
          Object.entries(s.subjects).map(([k, v]) => [k, Math.max(40, Math.min(100, v + rand(-4, 5)))])
        ) as typeof s.subjects,
      }
    }))
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateData, 8000)
    return () => clearInterval(interval)
  }, [simulateData])

  const handleApproveLeave = (roll: string) => {
    setLeaveRequests(prev => prev.map(r => r.roll === roll ? { ...r, status: "approved" as const } : r))
    setPendingLeaves(prev => Math.max(0, prev - 1))
  }

  const handleRejectLeave = (roll: string) => {
    setLeaveRequests(prev => prev.map(r => r.roll === roll ? { ...r, status: "rejected" as const } : r))
    setPendingLeaves(prev => Math.max(0, prev - 1))
  }

  const lowAttendanceCount = students.filter(s => s.attendance < 75).length
  const criticalCount = students.filter(s => s.attendance < 60).length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Batch Advisor Console</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            MONITORING BATCH: <span className="text-primary font-bold">CSE 2021-25 A</span> | {students.length} NODES
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
            BATCH_ACTIVE
          </Badge>
          <Badge variant="outline" className={cn(
            "font-mono",
            pendingLeaves > 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-muted text-muted-foreground"
          )}>
            {pendingLeaves} PENDING_LEAVES
          </Badge>
          <Button variant="outline" size="icon" className="h-9 w-9 border-white/5" onClick={simulateData}>
            <Activity className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-colors">
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
            <CardHeader className="border-b border-white/5 bg-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Batch Student Overview</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-500">{students.filter(s => s.status === "good").length} Good</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-amber-500">{students.filter(s => s.status === "warning").length} Low</span>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    <div className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-destructive">{criticalCount} Critical</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-mono">AUTO_REFRESH_8S</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {students.map((student, i) => (
                  <div key={i} className="flex items-center px-6 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center text-[10px] font-bold font-mono border",
                        student.status === "good" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                        student.status === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                        "bg-destructive/10 border-destructive/20 text-destructive"
                      )}>
                        {student.roll.slice(-3)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase">{student.name}</p>
                        <p className="text-[9px] font-mono text-muted-foreground">{student.roll}</p>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-6">
                      {Object.entries(student.subjects).map(([sub, val]) => (
                        <div key={sub} className="flex flex-col items-center min-w-[48px]">
                          <span className="text-[7px] font-mono text-muted-foreground uppercase">{sub}</span>
                          <span className={cn(
                            "text-[10px] font-bold font-mono",
                            val < 60 ? "text-destructive" : val < 75 ? "text-amber-500" : "text-emerald-500"
                          )}>{val}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="w-20">
                        <Progress value={student.attendance} className={cn(
                          "h-1.5",
                          student.status === "critical" ? "bg-destructive/20" :
                          student.status === "warning" ? "bg-amber-500/20" : "bg-white/5"
                        )} />
                      </div>
                      <span className={cn(
                        "text-[11px] font-bold font-mono w-10 text-right",
                        student.status === "critical" ? "text-destructive" :
                        student.status === "warning" ? "text-amber-500" : "text-emerald-500"
                      )}>
                        {student.attendance}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <NotificationPanel token={token} role="advisor" />

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Leave Requests</CardTitle>
                </div>
                <Badge className={cn(
                  "font-mono text-[9px]",
                  pendingLeaves > 0 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-muted text-muted-foreground"
                )}>
                  {pendingLeaves} PENDING
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {leaveRequests.filter(r => r.status === "pending").map((req, i) => (
                <div key={i} className="p-4 bg-secondary/30 rounded-lg border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase">{req.name}</p>
                      <p className="text-[9px] font-mono text-muted-foreground">{req.roll}</p>
                    </div>
                    <Badge variant="outline" className="text-[8px] border-amber-500/20 text-amber-500 font-mono uppercase">Pending</Badge>
                  </div>
                  <div className="text-[9px] font-mono text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {req.from} → {req.to}
                  </div>
                  <p className="text-[9px] text-muted-foreground italic">&ldquo;{req.reason}&rdquo;</p>
                  <div className="flex gap-2">
                    <Button size="sm" className="h-7 flex-1 text-[9px] font-bold uppercase bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => handleApproveLeave(req.roll)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                    </Button>
                    <Button size="sm" className="h-7 flex-1 text-[9px] font-bold uppercase" variant="destructive"
                      onClick={() => handleRejectLeave(req.roll)}>
                      <AlertTriangle className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
              {leaveRequests.filter(r => r.status === "pending").length === 0 && (
                <div className="py-8 text-center text-[10px] font-mono text-muted-foreground uppercase opacity-50">
                  <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
                  All leave requests resolved.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {students.filter(s => s.attendance < 65).map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                  <div className="flex items-center gap-3 min-w-0">
                    <GraduationCap className="h-4 w-4 text-destructive shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase truncate">{s.name}</p>
                      <p className="text-[8px] font-mono text-muted-foreground">{s.roll}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] text-destructive border-destructive/20 bg-destructive/5 shrink-0 ml-2">
                    {s.attendance}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Batch Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">Total Students</span>
                <span className="font-bold">{students.length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">Attendance &ge; 75%</span>
                <span className="font-bold text-emerald-500">{students.filter(s => s.attendance >= 75).length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">Attendance 60-74%</span>
                <span className="font-bold text-amber-500">{students.filter(s => s.attendance >= 60 && s.attendance < 75).length}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">Attendance &lt; 60%</span>
                <span className="font-bold text-destructive">{criticalCount}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-muted-foreground uppercase">Pending Leaves</span>
                <span className="font-bold text-amber-500">{pendingLeaves}</span>
              </div>
              <Progress 
                value={(students.filter(s => s.attendance >= 75).length / students.length) * 100} 
                className="h-1.5 bg-white/5 mt-2" 
              />
              <div className="flex items-center gap-2 text-[9px] font-mono text-emerald-500 pt-1">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                Auto-refresh every 8s
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
