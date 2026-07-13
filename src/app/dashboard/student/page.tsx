
"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Profile {
  fullName: string
  rollNumber: string
  department: string
  semester: string
  assignedBatch: string
}

export default function StudentDashboard() {
  const [mounted, setMounted] = useState(false)
  const { user, token, refresh } = useAuth()
  const [editing, setEditing] = useState(false)
  const [editSemester, setEditSemester] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const profile: Profile | null = user ? {
    fullName: user.fullName,
    rollNumber: user.rollNumber,
    department: user.department,
    semester: user.semester,
    assignedBatch: (user as any).assignedBatch || '',
  } : null

  useEffect(() => {
    if (user) setEditSemester(user.semester)
  }, [user])

  async function handleSaveSemester() {
    if (!editSemester.trim() || editSemester === user?.semester) {
      setEditing(false)
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token, semester: editSemester.trim() }),
      })
      if (!res.ok) throw new Error("Failed to update semester")
      await refresh()
      toast({ title: "SEMESTER_UPDATED", description: `Semester set to ${editSemester.trim()}.` })
      setEditing(false)
    } catch (error: any) {
      toast({ variant: "destructive", title: "UPDATE_FAILED", description: error.message })
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || !token) {
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

  const overallAttendance = 83
  const classesAttended = 62
  const classesTotal = 75
  const attendanceColor = overallAttendance >= 75 ? "text-emerald-500" : overallAttendance >= 60 ? "text-amber-500" : "text-destructive"

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
          {editing ? (
            <Input
              value={editSemester}
              onChange={(e) => setEditSemester(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveSemester(); if (e.key === "Escape") { setEditing(false); setEditSemester(user?.semester || ""); } }}
              className="h-6 w-16 text-[10px] bg-secondary/50"
              placeholder="7"
              autoFocus
            />
          ) : (
            <Badge
              variant="outline"
              className="bg-primary/10 text-primary border-primary/20 font-mono uppercase cursor-pointer hover:bg-primary/20"
              onClick={() => setEditing(true)}
            >
              SEM {profile.semester || 'X'}
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-sidebar/30 border-sidebar-border col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Overall Attendance</span>
              <Badge variant="outline" className={cn("text-[9px] font-mono", attendanceColor)}>
                {overallAttendance}%
              </Badge>
            </div>
            <Progress value={overallAttendance} className={cn("h-2", overallAttendance < 60 ? "bg-destructive/20" : overallAttendance < 75 ? "bg-amber-500/20" : "bg-white/5")} />
            <div className="flex justify-between mt-2 text-[9px] font-mono text-muted-foreground">
              <span>{classesAttended} attended</span>
              <span>{classesTotal} total</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-lg font-headline font-bold text-emerald-500">62</p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">Present This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-lg font-headline font-bold text-amber-500">13</p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">Absences</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
