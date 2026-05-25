
"use client"

import { Activity, ShieldCheck, Database, Camera, Cpu, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LiveScanLog } from "@/components/dashboard/live-scan-log"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const metrics = [
    { label: "CPU Usage", value: "14%", icon: Cpu, color: "text-blue-500", status: "Optimal" },
    { label: "GPU Load", value: "62%", icon: Activity, color: "text-accent", status: "Inference Active" },
    { label: "DB Latency", value: "24ms", icon: Database, color: "text-emerald-500", status: "Healthy" },
    { label: "Active RFID", value: "4 Nodes", icon: ShieldCheck, color: "text-purple-500", status: "Connected" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight">System Infrastructure</h1>
        <p className="text-muted-foreground">Global monitoring for RFID nodes and P2Net compute cluster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors`}>
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-sidebar-border uppercase">
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                <p className="text-2xl font-headline font-bold">{metric.value}</p>
              </div>
              <Progress value={parseInt(metric.value)} className="mt-4 h-1 bg-secondary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <AttendanceStats />
          
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Camera Analytics Node Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-sidebar-border group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-background flex items-center justify-center overflow-hidden border border-sidebar-border">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Node-01: Main Lecture Hall</p>
                      <p className="text-xs text-muted-foreground font-mono">rtsp://192.168.1.104/video_feed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-1">ONLINE</Badge>
                    <p className="text-[10px] text-muted-foreground font-mono">FPS: 24.5 | L: 12ms</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-sidebar-border group hover:border-primary/50 transition-colors opacity-50">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-background flex items-center justify-center overflow-hidden border border-sidebar-border">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Node-02: Labs Corridor</p>
                      <p className="text-xs text-muted-foreground font-mono">rtsp://192.168.1.108/video_feed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">OFFLINE</Badge>
                    <p className="text-[10px] text-muted-foreground font-mono">SIGNAL LOST</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <LiveScanLog />
        </div>
      </div>
    </div>
  )
}
