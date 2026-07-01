
"use client"

import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentAttendance } from "@/components/dashboard/student-attendance"
import { LeaveRequestForm } from "@/components/dashboard/leave-request-form"
import { SurveyView } from "@/components/dashboard/survey-view"
import { StudentNotifications } from "@/components/dashboard/student-notifications"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { Bell, ClipboardCheck, FileText, Calendar, Send, User, Loader2 } from "lucide-react"
import { useUser, useDoc, useFirestore } from "@/firebase"
import { doc } from "firebase/firestore"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("attendance")
  const [mounted, setMounted] = useState(false)
  const { user, loading: authLoading } = useUser()
  const db = useFirestore()

  const userDocRef = useMemo(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])

  const { data: profile, loading: profileLoading } = useDoc(userDocRef)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || authLoading || profileLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="p-8 text-center space-y-4">
        <User className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
        <p className="text-sm font-mono uppercase text-muted-foreground">Profile node not found in registry.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Student Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            Node: {profile.rollNumber || 'GUEST'} | {profile.department?.toUpperCase()} | {profile.fullName?.toUpperCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono">
            RFID_CONNECTED
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono uppercase">
            SEM_{profile.semester || 'X'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="attendance" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row gap-8">
          <TabsList className="flex flex-row lg:flex-col h-auto gap-1 bg-secondary/30 p-1 lg:w-64 rounded-xl border border-white/5 shrink-0 overflow-x-auto">
            <TabsTrigger value="attendance" className="flex-1 lg:flex-none justify-start text-[10px] uppercase font-bold tracking-widest py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              <ClipboardCheck className="h-3.5 w-3.5 mr-3 shrink-0" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="timetable" className="flex-1 lg:flex-none justify-start text-[10px] uppercase font-bold tracking-widest py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Calendar className="h-3.5 w-3.5 mr-3 shrink-0" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex-1 lg:flex-none justify-start text-[10px] uppercase font-bold tracking-widest py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              <Send className="h-3.5 w-3.5 mr-3 shrink-0" />
              Leave Request
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 lg:flex-none justify-start text-[10px] uppercase font-bold tracking-widest py-3 px-4 relative data-[state=active]:bg-primary data-[state=active]:text-white">
              <Bell className="h-3.5 w-3.5 mr-3 shrink-0" />
              Notifications
              <span className="absolute right-3 top-1/2 -translate-y-1/2 h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
            </TabsTrigger>
            <TabsTrigger value="survey" className="flex-1 lg:flex-none justify-start text-[10px] uppercase font-bold tracking-widest py-3 px-4 data-[state=active]:bg-primary data-[state=active]:text-white">
              <FileText className="h-3.5 w-3.5 mr-3 shrink-0" />
              Surveys
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="attendance" className="mt-0 outline-none space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">Compliance Analytics</h2>
              </div>
              <StudentAttendance />
            </TabsContent>

            <TabsContent value="timetable" className="mt-0 outline-none space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <h2 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground">Master Schedule: {profile.assignedBatch || 'GENERAL'}</h2>
              </div>
              <TimetableView />
            </TabsContent>

            <TabsContent value="leave" className="mt-0 outline-none">
              <LeaveRequestForm />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 outline-none">
              <StudentNotifications />
            </TabsContent>

            <TabsContent value="survey" className="mt-0 outline-none">
              <SurveyView />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
