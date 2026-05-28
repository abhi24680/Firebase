
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, BookOpen, AlertCircle } from "lucide-react"

export default function AdvisorAttendance() {
  const subjectAttendance = [
    { subject: "Data Structures", code: "CSE201", avg: 85, lowCount: 2 },
    { subject: "Operating Systems", code: "CSE203", avg: 78, lowCount: 5 },
    { subject: "Computer Networks", code: "CSE202", avg: 82, lowCount: 3 },
    { subject: "Maths III", code: "MAT301", avg: 90, lowCount: 0 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Batch Analytics</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Cross-Subject Attendance Supervision</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceStats />
        </div>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Subject-Wise Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectAttendance.map((sub) => (
              <div key={sub.code} className="p-4 bg-secondary/30 border border-white/5 rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase">{sub.subject}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{sub.code}</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-primary/20">{sub.avg}%</Badge>
                </div>
                {sub.lowCount > 0 && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span className="text-[9px] font-mono uppercase">{sub.lowCount} Students below 75%</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
