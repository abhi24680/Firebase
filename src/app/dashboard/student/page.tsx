
"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentAttendance } from "@/components/dashboard/student-attendance"
import { LeaveRequestForm } from "@/components/dashboard/leave-request-form"
import { SurveyView } from "@/components/dashboard/survey-view"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("attendance")

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Student Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Node: S-2023-PRC-CA003 | ACTIVE_SESSION</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
            RFID_CONNECTED
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono uppercase">
            SEM_3
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="attendance" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-8 bg-secondary/50">
          <TabsTrigger value="attendance" className="text-[10px] uppercase font-bold tracking-widest">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-[10px] uppercase font-bold tracking-widest">
            Leave Request
          </TabsTrigger>
          <TabsTrigger value="survey" className="text-[10px] uppercase font-bold tracking-widest">
            Survey
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-0">
          <StudentAttendance />
        </TabsContent>

        <TabsContent value="leave" className="mt-0">
          <div className="max-w-4xl mx-auto">
            <LeaveRequestForm />
          </div>
        </TabsContent>

        <TabsContent value="survey" className="mt-0">
          <SurveyView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
