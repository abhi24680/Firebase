"use client"

import { TimetableView } from "@/components/dashboard/timetable-view"
import { useAuth } from "@/lib/auth-context"

export default function StudentTimetablePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">Master Schedule: {(user as any)?.assignedBatch || 'GENERAL'}</h2>
      </div>
      <TimetableView />
    </div>
  )
}
