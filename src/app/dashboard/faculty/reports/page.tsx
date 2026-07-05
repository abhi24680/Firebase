"use client"

import { FileSpreadsheet, Download, BarChart3, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { toast } from "@/hooks/use-toast"

export default function FacultyReports() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Reports & Analytics</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            Export session data and view attendance analytics.
          </p>
        </div>
        <Button className="bg-primary font-bold uppercase text-[10px] h-11 px-6" onClick={() => toast({ title: "EXPORT_INITIATED", description: "Report generation started." })}>
          <Download className="mr-2 h-4 w-4" />
          GENERATE REPORT
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AttendanceStats />
        </div>

        <div className="space-y-6">
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Quick Exports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {["Session CSV", "Compliance Report", "Monthly Summary"].map((label) => (
                <Button key={label} variant="outline" className="w-full justify-between border-white/5 hover:bg-white/5 text-[10px] uppercase font-bold h-10" onClick={() => toast({ title: `${label.toUpperCase().replace(/\s+/g, '_')}_GENERATED`, description: "File ready for download." })}>
                  <span>{label}</span>
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Period</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Current Academic Semester
              <Badge variant="outline" className="text-[9px] font-mono">SEM III</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
