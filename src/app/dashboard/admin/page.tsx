
"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Activity, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Network,
  Server,
  RefreshCw,
  Clock,
  HardDrive,
  Users,
  Zap,
  Wifi,
  Database,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LiveScanLog } from "@/components/dashboard/live-scan-log"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function AdminDashboard() {
  const [census, setCensus] = useState({
    aiCount: 472,
    rfidCount: 468,
    lastSync: "2 seconds ago",
    totalStudents: 520,
    activeNodes: 24,
  })

  const [metrics, setMetrics] = useState([
    { label: "Core Compute", value: "14.2%", icon: Cpu, color: "text-blue-500", status: "Optimal", progress: 14 },
    { label: "P2Net Inference", value: "28.1%", icon: Activity, color: "text-accent", status: "Active", progress: 28 },
    { label: "Mesh Latency", value: "12ms", icon: Network, color: "text-emerald-500", status: "Low", progress: 12 },
    { label: "Storage Node", value: "84%", icon: HardDrive, color: "text-purple-500", status: "Healthy", progress: 84 },
  ])

  const [clusterNodes, setClusterNodes] = useState([
    { name: "RFID Hub Alpha", status: "online", load: 34, uptime: "99.9%" },
    { name: "AI Inference Node", status: "online", load: 62, uptime: "99.7%" },
    { name: "Database Cluster", status: "online", load: 45, uptime: "100%" },
    { name: "Auth Gateway", status: "online", load: 18, uptime: "99.9%" },
    { name: "Backup Replica", status: "standby", load: 2, uptime: "99.5%" },
    { name: "Load Balancer", status: "online", load: 38, uptime: "100%" },
  ])

  const simulateData = useCallback(() => {
    setCensus(prev => ({
      aiCount: prev.aiCount + (Math.random() > 0.6 ? 1 : -1) * randomBetween(0, 2),
      rfidCount: prev.rfidCount + (Math.random() > 0.7 ? 1 : -1) * randomBetween(0, 1),
      lastSync: "Just now",
      totalStudents: 520,
      activeNodes: randomBetween(22, 26),
    }))

    setMetrics(prev => prev.map(m => {
      const base = parseInt(m.value) || 0
      const drift = randomBetween(-3, 3)
      const newVal = Math.max(1, Math.min(100, base + drift))
      return {
        ...m,
        value: m.label === "Mesh Latency" 
          ? `${Math.max(5, 12 + randomBetween(-3, 5))}ms`
          : `${newVal}%`,
        progress: newVal,
        status: newVal > 80 ? "Healthy" : newVal > 40 ? "Active" : "Optimal",
      }
    }))

    setClusterNodes(prev => prev.map(n => ({
      ...n,
      load: Math.min(100, Math.max(0, n.load + randomBetween(-8, 8))),
      status: Math.random() > 0.95 ? "degraded" : n.status === "degraded" && Math.random() > 0.7 ? "online" : n.status,
    })))
  }, [])

  useEffect(() => {
    const interval = setInterval(simulateData, 5000)
    return () => clearInterval(interval)
  }, [simulateData])

  const isMatched = census.aiCount === census.rfidCount
  const diff = Math.abs(census.aiCount - census.rfidCount)
  const onlineNodes = clusterNodes.filter(n => n.status === "online").length

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase text-glow">Infrastructure Command</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-[0.25em]">
            Global Control Center for RFID Nodes and P2Net Compute Mesh.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-secondary/30 border border-white/5 rounded flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-mono text-muted-foreground uppercase">Cluster Nodes</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                {onlineNodes}/{clusterNodes.length} ONLINE
              </span>
            </div>
            <Server className="h-4 w-4 text-emerald-500" />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-white/5 hover:bg-primary/10" onClick={simulateData}>
            <RefreshCw className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="bg-sidebar/30 border-sidebar-border overflow-hidden group hover:neon-border transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                <Badge variant="outline" className="text-[9px] font-mono border-sidebar-border uppercase tracking-tighter">
                  {metric.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                <p className="text-2xl font-headline font-bold">{metric.value}</p>
              </div>
              <Progress value={metric.progress} className="mt-4 h-1 bg-white/5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden border-primary/10 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Network className="h-64 w-64" />
            </div>
            
            <CardHeader className="border-b border-white/5 bg-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Class Count (System Census)</CardTitle>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono text-[9px] animate-pulse">
                  LIVE_DATAFEED_PRC
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-10 relative z-10">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-2">
                      <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                        <Cpu className="h-3 w-3 text-primary" /> P2Net Detection
                      </div>
                      <p className={cn(
                        "text-7xl font-headline font-bold tracking-tighter transition-colors duration-300",
                        census.aiCount !== census.rfidCount ? "text-amber-400 text-glow" : "text-primary"
                      )}>
                        {census.aiCount}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase">Vision Nodes Active</p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                        <ShieldCheck className="h-3 w-3 text-emerald-500" /> RFID Verified
                      </div>
                      <p className="text-7xl font-headline font-bold text-white tracking-tighter">
                        {census.rfidCount}
                      </p>
                      <p className="text-[9px] text-muted-foreground font-mono uppercase">Decentralized Logs</p>
                    </div>
                  </div>

                  <div className={cn(
                    "p-6 rounded-xl border flex items-center gap-6 transition-all duration-500",
                    isMatched ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"
                  )}>
                    <div className={cn(
                      "h-14 w-14 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                      isMatched ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"
                    )}>
                      {isMatched ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-lg font-bold uppercase tracking-tight font-headline",
                        isMatched ? "text-emerald-500" : "text-amber-500"
                      )}>
                        {isMatched ? "System Synchronized" : "Census Discrepancy"}
                      </p>
                      <div className="text-[10px] text-muted-foreground font-mono uppercase leading-relaxed mt-1">
                        {isMatched 
                          ? "Vision counts align with physical RFID tokens. No ghost nodes detected." 
                          : `${diff} unregistered occupants detected across active campus clusters.`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center space-y-8 border-l border-white/5 pl-10">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Total Enrolled</span>
                      <span className="text-white">{census.totalStudents}</span>
                    </div>
                    <Progress value={100} className="h-1 bg-white/5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> P2Net Sync Load</span>
                      <span className="text-primary">{Math.round((census.aiCount / census.totalStudents) * 100)}%</span>
                    </div>
                    <Progress value={(census.aiCount / census.totalStudents) * 100} className="h-1 bg-white/5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Wifi className="h-3 w-3 text-accent" /> Active Nodes</span>
                      <span className="text-accent">{census.activeNodes}</span>
                    </div>
                    <Progress value={(census.activeNodes / 32) * 100} className="h-1 bg-white/5" />
                  </div>
                  
                  <div className="pt-6 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Network Pipeline Active
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
                      <Clock className="h-3 w-3" />
                      Last Global Sync: {census.lastSync}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader className="border-b border-white/5 bg-secondary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Cluster Node Status</CardTitle>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/20 text-emerald-500">
                  AUTO_REFRESH_5S
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {clusterNodes.map((node, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        node.status === "online" ? "bg-emerald-500" :
                        node.status === "standby" ? "bg-amber-500" : "bg-destructive"
                      )} />
                      <span className="text-sm font-semibold uppercase tracking-tight">{node.name}</span>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">Load</span>
                        <div className="w-24">
                          <Progress value={node.load} className="h-1.5 bg-white/5" />
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">{node.load}%</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[8px] font-mono uppercase w-16 text-center",
                        node.status === "online" ? "border-emerald-500/20 text-emerald-500" :
                        node.status === "standby" ? "border-amber-500/20 text-amber-500" :
                        "border-destructive/20 text-destructive"
                      )}>
                        {node.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="h-[400px]">
            <AttendanceStats />
          </div>
        </div>

        <div className="xl:col-span-1 h-full space-y-8">
          <LiveScanLog />
        </div>
      </div>
    </div>
  )
}
