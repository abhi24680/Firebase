"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { Calendar } from "lucide-react"

export default function FacultyTimetable() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">My Schedule</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
          Assigned lectures and lab sessions for the current semester.
        </p>
      </div>
      <TimetableView />
    </div>
  )
}
