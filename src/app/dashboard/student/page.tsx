
"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentAttendance } from "@/components/dashboard/student-attendance"
import { LeaveRequestForm } from "@/components/dashboard/leave-request-form"
import { SurveyView } from "@/components/dashboard/survey-view"
import { StudentNotifications } from "@/components/dashboard/student-notifications"
import { Bell, ClipboardCheck, FileText, LayoutDashboard, Send } from "lucide-react"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [mounted, setMounted] = useState(false)
  
  // Simulated student identity
  const [studentInfo] = useState({
    nodeId: "S-2023-PRC-CA003",
    semester: "SEM_3",
    name: "Abhijith PRC",
    dept: "Computer Science"
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Student Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            Node: {studentInfo.nodeId} | {studentInfo.dept.toUpperCase()} | {studentInfo.name.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
            RFID_CONNECTED
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono uppercase">
            {studentInfo.semester}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="attendance" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-secondary/50 p-1 mb-8 w-full md:w-fit rounded-lg">
          <TabsTrigger value="attendance" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest py-2 px-6">
            <ClipboardCheck className="h-3.5 w-3.5 mr-2" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest py-2 px-6">
            <Send className="h-3.5 w-3.5 mr-2" />
            Leave Request
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest py-2 px-6 relative">
            <Bell className="h-3.5 w-3.5 mr-2" />
            Notifications
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full animate-pulse" />
          </TabsTrigger>
          <TabsTrigger value="survey" className="flex-1 md:flex-none text-[10px] uppercase font-bold tracking-widest py-2 px-6">
            <FileText className="h-3.5 w-3.5 mr-2" />
            Surveys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-0 outline-none">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">Subject Wise Compliance</h2>
            </div>
            <StudentAttendance />
          </div>
        </TabsContent>

        <TabsContent value="leave" className="mt-0 outline-none">
          <div className="max-w-4xl mx-auto">
            <LeaveRequestForm />
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 outline-none">
          <div className="max-w-4xl mx-auto">
            <StudentNotifications />
          </div>
        </TabsContent>

        <TabsContent value="survey" className="mt-0 outline-none">
          <SurveyView />
        </TabsContent>
      </Tabs>
    </div>
  )
}
