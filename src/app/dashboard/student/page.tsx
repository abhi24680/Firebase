
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock, 
  MapPin, 
  UserCheck, 
  UserX, 
  CalendarDays, 
  Bell, 
  FileText, 
  ChevronRight,
  TrendingDown,
  Info
} from "lucide-react"
import { StudentAttendance } from "@/components/dashboard/student-attendance"
import { LeaveRequestForm } from "@/components/dashboard/leave-request-form"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const currentStatus = {
    class: "Data Structures & Algorithms",
    time: "10:30 AM - 11:30 AM",
    location: "Lecture Hall 4B",
    status: "ongoing", // or "next"
    presence: "IN", // "IN" or "OUT" based on RFID
  }

  const notifications = [
    { id: 1, type: "attendance", text: "Attendance marked for DSA (10:35 AM)", time: "2h ago", priority: "low" },
    { id: 2, type: "warning", text: "Attendance below 75% in Computer Networks", time: "1d ago", priority: "high" },
    { id: 3, type: "leave", text: "Leave request for 24th Oct APPROVED by HOD", time: "2d ago", priority: "medium" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight">Student Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Node: S-2023-CSE-003 | ACTIVE_SESSION</p>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Center Class Status */}
        <Card className="xl:col-span-2 bg-sidebar/30 border-sidebar-border overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4">
            <Badge className={currentStatus.presence === 'IN' ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-destructive"}>
              {currentStatus.presence === 'IN' ? 'CURRENTLY_IN_CLASS' : 'OUT_OF_CLASS'}
            </Badge>
          </div>
          <CardHeader>
            <CardDescription className="uppercase tracking-[0.2em] font-mono text-[10px]">Active Node Monitoring</CardDescription>
            <CardTitle className="text-2xl font-headline">
              {currentStatus.status === 'ongoing' ? 'Ongoing Session' : 'Next Session'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-8 py-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-4xl font-headline font-bold text-primary text-glow">{currentStatus.class}</h3>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-mono uppercase">{currentStatus.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-mono uppercase">{currentStatus.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 animate-pulse">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%] animate-shimmer" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Bar */}
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">System Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-1">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-l-2 border-l-transparent hover:border-l-primary group">
                  <div className={`mt-1 h-1.5 w-1.5 rounded-full ${notif.priority === 'high' ? 'bg-destructive animate-pulse' : notif.priority === 'medium' ? 'bg-amber-500' : 'bg-primary'}`} />
                  <div className="flex-1">
                    <p className="text-xs font-medium leading-tight group-hover:text-primary transition-colors">{notif.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono uppercase">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-8 bg-secondary/50">
          <TabsTrigger value="attendance" className="text-[10px] uppercase font-bold tracking-widest">
            Attendance Log
          </TabsTrigger>
          <TabsTrigger value="timetable" className="text-[10px] uppercase font-bold tracking-widest">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="leave" className="text-[10px] uppercase font-bold tracking-widest">
            Leave Portal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <StudentAttendance />
        </TabsContent>

        <TabsContent value="timetable">
          <TimetableView />
        </TabsContent>

        <TabsContent value="leave">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaveRequestForm />
            <div className="space-y-6">
              <Card className="bg-sidebar/30 border-sidebar-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Leave Status Flow</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 font-mono text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Submit Application</span>
                  </div>
                  <div className="w-px h-6 bg-border ml-1" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Faculty Advisor: Notified (View Only)</span>
                  </div>
                  <div className="w-px h-6 bg-border ml-1" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="text-primary font-bold">HOD: Awaiting Approval</span>
                  </div>
                </CardContent>
              </Card>
              <Alert className="bg-primary/5 border-primary/20">
                <Info className="h-4 w-4" />
                <AlertTitle className="text-[10px] font-bold uppercase">Leave Policy</AlertTitle>
                <AlertDescription className="text-[10px] uppercase text-muted-foreground">
                  Apply at least 24 hours before the requested date. Medical leaves require proof upload.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
