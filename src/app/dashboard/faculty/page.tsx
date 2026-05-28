
"use client"

import { useState, useEffect } from "react"
import { Camera, Users, Clock, ShieldCheck, Zap, ArrowRight, RefreshCw, BarChart3 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

export default function FacultyDashboard() {
  const [isScanning, setIsScanning] = useState(true)
  const [rfidCount, setRfidCount] = useState(38)
  const [aiCount, setAiCount] = useState(40)
  const [timeLeft, setTimeLeft] = useState(2400) // 40 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const triggerSnapshot = () => {
    toast({
      title: "P2NET_SNAPSHOT_TRIGGERED",
      description: "AI vision node is recalculating crowd density.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Active Session Terminal</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">
            Subject: CSE201 - Data Structures | Room: LH-301 | Faculty: Dr. Alan Turing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Session Remaining</span>
            <span className="text-xl font-headline font-bold text-primary">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="destructive" className="font-bold text-[10px] uppercase tracking-tighter">
            TERMINATE SESSION
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="bg-secondary/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">P2Net Live Inference</CardTitle>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono animate-pulse uppercase">
              STREAM_ACTIVE
            </Badge>
          </CardHeader>
          <CardContent className="p-0 aspect-video bg-black/40 relative group">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
             <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono text-emerald-500 uppercase">
               Inference: Human_Detection_Mode
             </div>
             
             {/* Simulated Bounding Boxes */}
             <div className="absolute top-[20%] left-[30%] w-12 h-20 border border-emerald-500/50 bg-emerald-500/10" />
             <div className="absolute top-[25%] left-[45%] w-12 h-20 border border-emerald-500/50 bg-emerald-500/10" />
             <div className="absolute top-[15%] left-[60%] w-12 h-20 border border-emerald-500/50 bg-emerald-500/10" />

             <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center space-y-2">
                 <p className="text-4xl font-headline font-bold text-white tracking-tighter">{aiCount}</p>
                 <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">AI_HEAD_COUNT</p>
               </div>
             </div>
          </CardContent>
          <CardFooter className="bg-secondary/20 py-4 flex justify-between items-center px-6">
            <Button variant="outline" size="sm" className="bg-background/50 border-white/5 text-[10px] uppercase font-bold" onClick={triggerSnapshot}>
              <RefreshCw className="mr-2 h-3 w-3" />
              REFRESH AI SNAPSHOT
            </Button>
            <div className="flex gap-4">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">GPU_LOAD: 64%</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">LATENCY: 12ms</span>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">RFID Sync Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-headline font-bold text-emerald-500">{rfidCount}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">SCANS_VERIFIED</p>
                </div>
                <div className="h-10 w-10 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
              <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-amber-500 uppercase">Sync Mismatch</span>
                  <Badge variant="outline" className="text-[9px] border-amber-500/20 text-amber-500">+{aiCount - rfidCount} PROXIES</Badge>
                </div>
                <p className="text-[9px] text-muted-foreground font-mono leading-relaxed">
                  P2Net detected {aiCount} entities while RFID logged {rfidCount}. Proxies might be present or RFID tags missing.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Live Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[200px] overflow-y-auto space-y-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-[10px] font-mono">
                    <span className="text-muted-foreground">10:45:2{i} AM</span>
                    <span className="font-bold">STUDENT_ENTRY: {i}00{i}</span>
                    <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500">OK</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="ghost" className="w-full text-[10px] uppercase font-bold text-primary" asChild>
                <a href="/dashboard/faculty/attendance">
                  VIEW FULL ATTENDANCE SHEET <ArrowRight className="ml-2 h-3 w-3" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
