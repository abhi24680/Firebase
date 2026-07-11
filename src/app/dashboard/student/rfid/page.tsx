"use client"

import { RfidAttendanceView } from "@/components/dashboard/rfid-attendance-view"
import { useAuth } from "@/lib/auth-context"

export default function StudentRfidPage() {
  const { token } = useAuth()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">
          RFID Attendance — People Count
        </h2>
      </div>
      <RfidAttendanceView token={token} />
    </div>
  )
}
