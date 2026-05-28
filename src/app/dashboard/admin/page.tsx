
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Activity, ShieldCheck, Database, Camera, Cpu, Users, Eye, Loader2, RefreshCw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LiveScanLog } from "@/components/dashboard/live-scan-log"
import { AttendanceStats } from "@/components/dashboard/attendance-stats"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { analyzeCrowd } from "@/ai/flows/analyze-crowd-flow"
import { toast } from "@/hooks/use-toast"

export default function AdminDashboard() {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isInferenceActive, setIsInferenceActive] = useState(false)
  const [aiDetectedCount, setAiDetectedCount] = useState<number>(0)
  const [rfidCount, setRfidCount] = useState(468)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const [metrics, setMetrics] = useState([
    { label: "CPU Usage", value: "14%", icon: Cpu, color: "text-blue-500", status: "Optimal" },
    { label: "GPU Load", value: "12%", icon: Activity, color: "text-accent", status: "Idle" },
    { label: "DB Latency", value: "24ms", icon: Database, color: "text-emerald-500", status: "Healthy" },
    { label: "Active RFID", value: "4 Nodes", icon: ShieldCheck, color: "text-purple-500", status: "Connected" },
  ])

  // Sync video stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const runGlobalInference = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isInferenceActive) return

    setIsInferenceActive(true)
    const context = canvasRef.current.getContext('2d')
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 640, 480)
      const dataUrl = canvasRef.current.toDataURL('image/jpeg')
      
      try {
        const result = await analyzeCrowd({ imageBuffer: dataUrl })
        setAiDetectedCount(result.count)
        // Update GPU metric status
        setMetrics(prev => prev.map(m => 
          m.label === "GPU Load" ? { ...m, value: "88%", status: "Inference Active" } : m
        ))
        setTimeout(() => {
          setMetrics(prev => prev.map(m => 
            m.label === "GPU Load" ? { ...m, value: "12%", status: "Idle" } : m
          ))
        }, 2000)
      } catch (error) {
        console.error("Inference Error:", error)
      } finally {
        setIsInferenceActive(false)
      }
    }
  }, [isInferenceActive])

  // Auto-inference loop
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCameraActive) {
      runGlobalInference()
      interval = setInterval(runGlobalInference, 10000)
    }
    return () => clearInterval(interval)
  }, [isCameraActive, runGlobalInference])

  const startGlobalNode = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setIsCameraActive(true)
      toast({
        title: "GLOBAL_VISION_ACTIVE",
        description: "P2Net core is now processing real-time census data.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "INITIALIZATION_FAILED",
        description: "Could not establish connection to hardware vision node.",
      })
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase text-glow">System Infrastructure</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-[0.2em]">Global monitoring for RFID nodes and P2Net compute cluster.</p>
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
          <Card className="bg-primary/5 border-primary/20 neon-border overflow-hidden relative">
            <CardHeader className="border-b border-primary/10 bg-black/20 backdrop-blur-sm z-10 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className={cn("h-4 w-4 text-primary", isCameraActive && "animate-pulse")} />
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider">Live System Census</CardTitle>
                </div>
                <Badge variant={isCameraActive ? "default" : "outline"} className={cn("font-mono text-[10px]", isCameraActive && "bg-primary animate-pulse")}>
                  {isCameraActive ? "LIVE_STREAM_ACTIVE" : "STREAM_OFFLINE"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[400px] flex items-center justify-center bg-black/40">
              {!isCameraActive ? (
                <div className="text-center space-y-6 z-10 px-8">
                  <Camera className="h-16 w-16 text-muted-foreground/20 mx-auto" />
                  <div className="space-y-2">
                    <p className="text-xl font-headline font-bold uppercase tracking-tighter">Node Connection Required</p>
                    <p className="text-sm text-muted-foreground font-mono uppercase">Initialize P2Net Vision Node to see real-time data.</p>
                  </div>
                  <Button onClick={startGlobalNode} className="bg-primary font-bold shadow-lg shadow-primary/20 h-12 px-8">
                    INITIALIZE INFRASTRUCTURE
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 flex">
                  {/* Camera Preview */}
                  <div className="w-1/2 h-full relative border-r border-white/5 bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover opacity-60" />
                    <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/10 pointer-events-none" />
                    {isInferenceActive && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    )}
                  </div>
                  
                  {/* Census Numbers */}
                  <div className="w-1/2 h-full p-8 flex flex-col justify-center bg-black/60 backdrop-blur-md">
                    <div className="space-y-10">
                      <div className="space-y-2 group">
                        <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                          <Users className="h-3 w-3 text-primary" /> Global Occupancy (AI)
                        </div>
                        <p className="text-6xl font-headline font-bold text-primary tracking-tighter animate-in fade-in slide-in-from-left-4">
                          {aiDetectedCount || '--'}
                        </p>
                        <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          P2Net Node Sync Active
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                          <ShieldCheck className="h-3 w-3" /> Verified RFID Tags
                        </div>
                        <p className="text-6xl font-headline font-bold text-white tracking-tighter">
                          {rfidCount}
                        </p>
                        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-50">
                          Serial Scan Log: ACTIVE
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                          <Activity className="h-3 w-3 text-accent" /> Proxy Alerts
                        </div>
                        <p className={cn(
                          "text-6xl font-headline font-bold tracking-tighter transition-colors",
                          Math.abs(aiDetectedCount - rfidCount) > 2 ? "text-accent" : "text-emerald-500"
                        )}>
                          {aiDetectedCount > 0 ? Math.abs(aiDetectedCount - rfidCount) : '--'}
                        </p>
                        <div className={cn(
                          "text-[10px] font-mono uppercase",
                          aiDetectedCount > rfidCount ? "text-accent" : "text-emerald-500"
                        )}>
                          {aiDetectedCount > rfidCount ? "Potential Proxy Detected" : "Data Synchronized"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    <p className="text-[10px] text-muted-foreground font-mono">COUNT: {aiDetectedCount || 0}</p>
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
                    <p className="text-[10px] text-muted-foreground font-mono">COUNT: {Math.floor(rfidCount * 0.08)}</p>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
