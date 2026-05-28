
"use client"

import { useState } from "react"
import { Calendar, Edit3, Save, RefreshCw, Plus, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TimetableView } from "@/components/dashboard/timetable-view"
import { toast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function HODTimetable() {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSem, setSelectedSem] = useState("3")

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "MASTER_TIMETABLE_SYNCED",
      description: `Academic schedule for SEM ${selectedSem} updated and broadcasted.`,
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Master Schedule Editor</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Global departmental timetable management node.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSem} onValueChange={setSelectedSem}>
            <SelectTrigger className="w-[140px] bg-secondary/50 border-white/5 font-bold uppercase text-[10px]">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <SelectItem key={s} value={s.toString()} className="text-[10px] uppercase">Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isEditing ? (
            <Button className="bg-emerald-500 hover:bg-emerald-600 font-bold uppercase text-[10px]" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              PERSIST MASTER NODE
            </Button>
          ) : (
            <Button variant="outline" className="border-white/5 font-bold uppercase text-[10px]" onClick={() => setIsEditing(true)}>
              <Edit3 className="mr-2 h-4 w-4" />
              MODIFY GLOBAL SCHEDULE
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        <TimetableView />
        {isEditing && (
          <div className="absolute inset-0 bg-primary/5 backdrop-blur-[1px] border-2 border-primary/20 rounded-lg flex items-center justify-center z-20">
            <Card className="max-w-md bg-card/90 backdrop-blur-xl border-sidebar-border shadow-2xl">
              <CardContent className="p-8 text-center space-y-6">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto border border-primary/20">
                  <RefreshCw className="h-8 w-8 text-primary animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold uppercase tracking-tight">Interactive Mode Active</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-mono leading-relaxed">
                    Cell-level modifications are being buffered. Click an entry to swap modules or faculty nodes.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="text-[10px] uppercase font-bold" onClick={() => setIsEditing(false)}>ABORT</Button>
                  <Button className="bg-primary text-[10px] uppercase font-bold" onClick={handleSave}>COMMIT CHANGES</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-sidebar/30 border-sidebar-border p-6 space-y-4 border-dashed">
          <div className="flex items-center gap-2 text-primary">
            <Plus className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Add Slot Override</span>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase leading-relaxed">
            Initialize an unscheduled lecture or special workshop node for the current department mesh.
          </p>
          <Button variant="outline" size="sm" className="w-full text-[10px] uppercase font-bold">CONFIGURE OVERRIDE</Button>
        </Card>
      </div>
    </div>
  )
}
