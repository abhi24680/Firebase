
"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, Database, Camera, Cpu, Users, Eye, Zap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LiveScanLog } from "@/components/dashboard/live-scan-log"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  const [liveMetrics, setLiveMetrics] = useState({
    totalOccupants: 482,
    rfidVerified: 468,
    aiDiscrepancy: 14,
    nodesActive: 4
  })

  // Simulate real-time data fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => {
        const change = Math.floor(Math.random() * 3) - 1 // -1, 0, or 1
        return {
          ...prev,
          totalOccupants: Math.max(0, prev.totalOccupants + change),
          rfidVerified: Math.max(0, prev.rfidVerified + (change > 0 ? 1 : change < 0 ? -1 : 0))
        }
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { label: "CPU Usage", value: "14%", icon: Cpu, color: "text-blue-500", status: "Optimal" },
    { label: "GPU Load", value: "62%", icon: Activity, color: "text-accent", status: "Inference Active" },
    { label: "DB Latency", value: "24ms", icon: Database, color: "text-emerald-500", status: "Healthy" },
    { label: "Active RFID", value: "4 Nodes", icon: ShieldCheck, color: "text-purple-500", status: "Connected" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">System Infrastructure</h1>
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
          {/* Real-Time Census Card */}
          <Card className="bg-primary/5 border-primary/20 neon-border overflow-hidden">
            <CardHeader className="border-b border-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary animate-pulse" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Live System Census</CardTitle>
                </div>
                <Badge className="bg-primary text-white font-mono text-[10px] animate-pulse">LIVE_STREAM</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Global Occupancy (AI)</p>
                  <p className="text-5xl font-headline font-bold text-primary tracking-tighter">{liveMetrics.totalOccupants}</p>
                  <p className="text-[10px] text-emerald-500 font-mono">P2Net Verified</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Verified RFID Tags</p>
                  <p className="text-5xl font-headline font-bold text-white tracking-tighter">{liveMetrics.rfidVerified}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">Serial Scans Active</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Proxy Alerts</p>
                  <p className="text-5xl font-headline font-bold text-accent tracking-tighter">{liveMetrics.totalOccupants - liveMetrics.rfidVerified}</p>
                  <p className="text-[10px] text-accent font-mono">Potential Mismatch</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <AttendanceStats />
          
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Inference Node Activity
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
                      <p className="text-xs text-muted-foreground font-mono">PRC-LH-301 | P2Net Enabled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-1">ONLINE</Badge>
                    <p className="text-[10px] text-muted-foreground font-mono">COUNT: {Math.floor(liveMetrics.totalOccupants * 0.15)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-sidebar-border group hover:border-primary/50 transition-colors opacity-70">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded bg-background flex items-center justify-center overflow-hidden border border-sidebar-border">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">Node-03: IT Lab 2</p>
                      <p className="text-xs text-muted-foreground font-mono">PRC-LB-202 | P2Net Enabled</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 mb-1">ONLINE</Badge>
                    <p className="text-[10px] text-muted-foreground font-mono">COUNT: {Math.floor(liveMetrics.totalOccupants * 0.08)}</p>
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
