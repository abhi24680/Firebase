"use client"

import { StudentAttendance } from "@/components/dashboard/student-attendance"

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">Compliance Analytics</h2>
      </div>
      <StudentAttendance />
    </div>
  )
}
