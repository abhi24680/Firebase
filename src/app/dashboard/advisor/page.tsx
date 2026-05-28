
"use client"

import { Users, GraduationCap, ClipboardCheck, MessageSquare, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"

export default function AdvisorDashboard() {
  const batchMetrics = [
    { label: "Total Students", value: "64", icon: Users, color: "text-blue-500" },
    { label: "Avg Attendance", value: "82%", icon: ClipboardCheck, color: "text-emerald-500" },
    { label: "Low Attendance", value: "5", icon: TrendingUp, color: "text-amber-500" },
    { label: "New Alerts", value: "12", icon: MessageSquare, color: "text-accent" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">Batch Advisor Console</h1>
        <p className="text-muted-foreground">Monitoring assigned batch: <span className="text-primary font-bold">CSE 2021-25 A</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {batchMetrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                <p className="text-2xl font-headline font-bold">{metric.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceStats />
        </div>
        
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Critical Attendance Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-sidebar-border">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Student {i}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">Roll: CSE21-0{i}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 text-[10px]">
                    {65 - i}% ATTENDANCE
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
