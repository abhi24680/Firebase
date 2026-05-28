
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SubjectAttendance {
  id: string
  name: string
  code: string
  percentage: number
  attended: number
  total: number
  history: { date: string, status: 'present' | 'absent' }[]
}

const subjects: SubjectAttendance[] = [
  {
    id: "1",
    name: "Data Structures & Algorithms",
    code: "CSE201",
    percentage: 88,
    attended: 22,
    total: 25,
    history: [
      { date: "2024-10-20", status: "present" },
      { date: "2024-10-18", status: "present" },
      { date: "2024-10-16", status: "absent" },
      { date: "2024-10-14", status: "present" },
      { date: "2024-10-11", status: "present" },
    ]
  },
  {
    id: "2",
    name: "Computer Networks",
    code: "CSE202",
    percentage: 72,
    attended: 18,
    total: 25,
    history: [
      { date: "2024-10-21", status: "absent" },
      { date: "2024-10-19", status: "absent" },
      { date: "2024-10-17", status: "present" },
      { date: "2024-10-15", status: "absent" },
      { date: "2024-10-13", status: "present" },
    ]
  },
  {
    id: "3",
    name: "Operating Systems",
    code: "CSE203",
    percentage: 95,
    attended: 19,
    total: 20,
    history: [
      { date: "2024-10-20", status: "present" },
      { date: "2024-10-17", status: "present" },
      { date: "2024-10-14", status: "present" },
    ]
  }
]

export function StudentAttendance() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const chartData = subjects.map(s => ({
    name: s.code,
    percentage: s.percentage,
  }))

  return (
    <div className="space-y-8">
      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Visual Summary</CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase">Batch compliance overview</CardDescription>
          </div>
          <BarChart3 className="h-5 w-5 text-primary opacity-50" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer config={{
              percentage: { label: "Attendance %", color: "hsl(var(--primary))" }
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(v) => v.toUpperCase()}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.percentage < 75 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map((sub) => (
          <Card key={sub.id} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-[10px] font-mono tracking-tighter uppercase opacity-60">
                  {sub.code}
                </Badge>
                {sub.percentage < 75 && (
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    CRITICAL_LOW
                  </Badge>
                )}
              </div>
              <CardTitle className="text-sm font-bold uppercase truncate">{sub.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-headline font-bold text-primary">{sub.percentage}%</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">
                    LOGS: {sub.attended} / {sub.total} UNITS
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full border border-white/5 bg-secondary/30 flex items-center justify-center">
                   <Calendar className="h-5 w-5 text-primary opacity-50" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={sub.percentage} className={cn("h-1 bg-white/5", sub.percentage < 75 ? "bg-destructive/10" : "")} />
              </div>

              <Button 
                variant="ghost" 
                className="w-full h-8 text-[10px] uppercase font-mono tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 border-t border-white/5 rounded-none"
                onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
              >
                {expandedId === sub.id ? <ChevronUp className="h-3 w-3 mr-2" /> : <ChevronDown className="h-3 w-3 mr-2" />}
                {expandedId === sub.id ? 'HIDE_HISTORY' : 'VIEW_HISTORY_NODE'}
              </Button>

              {expandedId === sub.id && (
                <div className="pt-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                  {sub.history.map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/20 rounded border border-white/5 text-[10px] font-mono">
                      <span className="text-muted-foreground">{log.date}</span>
                      <div className="flex items-center gap-1.5">
                        {log.status === 'present' ? (
                          <div className="flex items-center gap-1.5 text-emerald-500">
                            <CheckCircle2 className="h-3 w-3" />
                            <span className="uppercase">Present</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-destructive">
                            <XCircle className="h-3 w-3" />
                            <span className="uppercase">Absent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
