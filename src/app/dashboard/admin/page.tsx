
"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, Database, Cpu, Users, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LiveScanLog } from "@/components/dashboard/live-scan-log"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function AdminDashboard() {
  const [census, setCensus] = useState({
    aiCount: 472,
    rfidCount: 468,
    lastSync: "2 seconds ago",
    status: "mismatch"
  })

  const [metrics, setMetrics] = useState([
    { label: "CPU Usage", value: "14%", icon: Cpu, color: "text-blue-500", status: "Optimal" },
    { label: "GPU Load", value: "12%", icon: Activity, color: "text-accent", status: "Idle" },
    { label: "DB Latency", value: "24ms", icon: Database, color: "text-emerald-500", status: "Healthy" },
    { label: "Active RFID", value: "4 Nodes", icon: ShieldCheck, color: "text-purple-500", status: "Connected" },
  ])

  // Simulation of live updates for institutional counts
  useEffect(() => {
    const interval = setInterval(() => {
      setCensus(prev => ({
        ...prev,
        aiCount: prev.aiCount + (Math.random() > 0.6 ? 1 : Math.random() < 0.4 ? -1 : 0),
        lastSync: "Just now"
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const isMatched = census.aiCount === census.rfidCount
  const diff = Math.abs(census.aiCount - census.rfidCount)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase text-glow">System Infrastructure</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-[0.2em]">Institutional monitoring for RFID nodes and P2Net compute cluster.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border overflow-hidden group hover:neon-border transition-all">
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
          {/* Streamlined Institutional Census Overview */}
          <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden relative group border-primary/10">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Users className="h-48 w-48" />
            </div>
            <CardHeader className="border-b border-white/5 bg-secondary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Institutional Census Overview</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    LIVE_FEED
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                        <Cpu className="h-3 w-3 text-primary" /> P2Net AI Count
                      </div>
                      <p className="text-7xl font-headline font-bold text-primary tracking-tighter">
                        {census.aiCount}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">Vision nodes active</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> RFID Verified
                      </div>
                      <p className="text-7xl font-headline font-bold text-white tracking-tighter">
                        {census.rfidCount}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase">Decentralized logs</p>
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-xl border flex items-center gap-6 transition-all duration-500",
                    isMatched ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                  )}>
                    <div className={cn(
                      "h-14 w-14 rounded-full flex items-center justify-center shrink-0",
                      isMatched ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"
                    )}>
                      {isMatched ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-lg font-bold uppercase tracking-tight",
                        isMatched ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {isMatched ? "Data Synchronized" : "Census Discrepancy"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono uppercase leading-relaxed">
                        {isMatched 
                          ? "Vision counts align with physical RFID tokens." 
                          : `Mismatch of ${diff} entities detected across active campus nodes.`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-8 border-l border-white/5 pl-10">
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        <span>Active Departments</span>
                        <span className="text-white">7 Units</span>
                      </div>
                      <Progress value={100} className="h-1 bg-white/5" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        <span>Cluster Stability</span>
                        <span className="text-emerald-500">99.8%</span>
                      </div>
                      <Progress value={99.8} className="h-1 bg-white/5" />
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                        <span>System Load</span>
                        <span>24%</span>
                      </div>
                      <Progress value={24} className="h-1 bg-white/5" />
                   </div>
                   <div className="pt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     P2Net Node Sync Active | {census.lastSync}
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <AttendanceStats />
        </div>

        <div className="xl:col-span-1">
          <LiveScanLog />
        </div>
      </div>
    </div>
  )
}
