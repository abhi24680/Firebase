
"use client"

import { useState } from "react"
import { Calendar, Edit3, Save, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { toast } from "@/hooks/use-toast"

export default function AdvisorTimetable() {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "TIMETABLE_SYNCED",
      description: "Batch schedule node updated across all student terminals.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Batch Schedule</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Timetable Node Management</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              PERSIST CHANGES
            </Button>
          ) : (
            <Button variant="outline" className="border-white/5" onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              MODIFY NODE
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <TimetableView />
        {isEditing && (
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-[2px] border-2 border-primary/20 rounded-lg flex items-center justify-center">
            <div className="bg-card p-6 border border-sidebar-border rounded-xl text-center shadow-2xl">
              <RefreshCw className="h-10 w-10 text-primary mx-auto mb-4 animate-spin-slow" />
              <p className="text-sm font-bold uppercase mb-2">Editor Mode Active</p>
              <p className="text-[10px] text-muted-foreground uppercase font-mono mb-4 italic">Interactive cell modification enabled.</p>
              <Button size="sm" className="bg-primary" onClick={handleSave}>SAVE SESSION</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
