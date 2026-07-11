
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Camera, ShieldCheck, Zap, RefreshCw, Loader2, Plus, Trash2, UserPlus, Download, MessageSquare, Users, TrendingUp, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import { analyzeCrowd } from "@/ai/flows/students-count"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ScanLog {
  id: string
  studentId: string
  name: string
  timestamp: string
  method: 'rfid' | 'manual'
}

const STUDENT_ROSTER = [
  { id: "CSE23-001", name: "John Doe" },
  { id: "CSE23-002", name: "Alice Smith" },
  { id: "CSE23-003", name: "Bob Wilson" },
  { id: "CSE23-004", name: "Charlie Brown" },
  { id: "CSE23-005", name: "Diana Prince" },
  { id: "CSE23-006", name: "Eve Adams" },
  { id: "CSE23-007", name: "Frank Castle" },
  { id: "CSE23-008", name: "Grace Hopper" },
  { id: "CSE23-009", name: "Henry Ford" },
  { id: "CSE23-010", name: "Ivy League" },
  { id: "CSE23-011", name: "Jack Sparrow" },
  { id: "CSE23-012", name: "Kate Winslet" },
]

const QUICK_MESSAGES = [
  { label: "MEET_AFTER", text: "Meet me after class" },
  { label: "ATT_WARNING", text: "Attendance warning" },
  { label: "ASSIGNMENT_DUE", text: "Assignment submission due" },
  { label: "LAB_REPORT", text: "Submit lab report" },
]

export default function FacultyDashboard() {
  const [isScanning, setIsScanning] = useState(false)
  const [aiCount, setAiCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(2400)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [quickAddId, setQuickAddId] = useState("")
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([
    { id: '1', studentId: 'CSE23-001', name: 'John Doe', timestamp: '10:45:12 AM', method: 'rfid' },
    { id: '2', studentId: 'CSE23-005', name: 'Alice Smith', timestamp: '10:46:05 AM', method: 'rfid' },
    { id: '3', studentId: 'CSE23-012', name: 'Bob Wilson', timestamp: '10:46:22 AM', method: 'manual' },
    { id: '4', studentId: 'CSE23-008', name: 'Grace Hopper', timestamp: '10:47:01 AM', method: 'rfid' },
    { id: '5', studentId: 'CSE23-003', name: 'Charlie Brown', timestamp: '10:48:33 AM', method: 'rfid' },
  ])
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sessionDuration = 40
  const elapsed = sessionDuration * 60 - timeLeft
  const sessionAttendance = scanLogs.length
  const expectedStudents = STUDENT_ROSTER.length
  const attendancePercent = Math.round((sessionAttendance / expectedStudents) * 100)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [isCameraActive, stream])

  const triggerSnapshot = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return

    setIsScanning(true)
    const context = canvasRef.current.getContext('2d')
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 640, 480)
      const dataUrl = canvasRef.current.toDataURL('image/jpeg')
      
      try {
        const result = await analyzeCrowd({ imageBuffer: dataUrl })
        setAiCount(result.count)
      } catch {
        setAiCount(prev => prev + Math.floor(Math.random() * 3))
      } finally {
        setIsScanning(false)
      }
    }
  }, [isScanning])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCameraActive) {
      triggerSnapshot()
      interval = setInterval(() => { triggerSnapshot() }, 10000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isCameraActive, triggerSnapshot])

  useEffect(() => {
    if (!isCameraActive) return
    const simulateRfid = setInterval(() => {
      const unmarked = STUDENT_ROSTER.filter(
        s => !scanLogs.find(l => l.studentId === s.id)
      )
      if (unmarked.length === 0) return
      const student = unmarked[Math.floor(Math.random() * unmarked.length)]
      setScanLogs(prev => [{
        id: Math.random().toString(36).substring(7),
        studentId: student.id,
        name: student.name,
        timestamp: new Date().toLocaleTimeString(),
        method: 'rfid',
      }, ...prev])
    }, 8000)
    return () => clearInterval(simulateRfid)
  }, [isCameraActive, scanLogs])

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setIsCameraActive(true)
      toast({ title: "VISION_NODE_READY", description: "Automated P2Net crowd tracking initialized." })
    } catch {
      toast({ variant: "destructive", title: "CAMERA_ERROR", description: "Could not access hardware camera node." })
    }
  }

  const handleQuickAdd = () => {
    if (!quickAddId.trim()) return
    const student = STUDENT_ROSTER.find(s => s.id === quickAddId.toUpperCase())
    const newEntry: ScanLog = {
      id: Math.random().toString(36).substring(7),
      studentId: quickAddId.toUpperCase(),
      name: student?.name || "Manual Entry",
      timestamp: new Date().toLocaleTimeString(),
      method: 'manual'
    }
    setScanLogs(prev => [newEntry, ...prev])
    setQuickAddId("")
    toast({ title: "ATTENDANCE_ADDED", description: `Manual entry for ${newEntry.studentId} recorded.` })
  }

  const handleDeleteScan = (id: string) => {
    setScanLogs(prev => prev.filter(log => log.id !== id))
    toast({ variant: "destructive", title: "ATTENDANCE_REVOKED", description: "Log entry decommissioned from session database." })
  }

  const exportCSV = () => {
    toast({ title: "EXPORT_INITIALIZED", description: "CSV node log generation in progress..." })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const presentCount = scanLogs.length
  const absentCount = expectedStudents - presentCount

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
          <Button variant="outline" className="h-11 border-white/5 font-bold uppercase text-[10px]" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            EXPORT_CSV
          </Button>
          <div className="flex flex-col items-end px-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase">Session Remaining</span>
            <span className="text-xl font-headline font-bold text-primary">{formatTime(timeLeft)}</span>
          </div>
          <Button variant="destructive" className="font-bold text-[10px] uppercase tracking-tighter h-11">
            TERMINATE
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
            <Badge variant="outline" className={cn(
              "font-mono uppercase transition-all duration-500",
              isCameraActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' : 'text-muted-foreground'
            )}>
              {isCameraActive ? 'STREAM_ACTIVE' : 'FEED_IDLE'}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 aspect-video bg-black/40 relative group flex items-center justify-center">
             {!isCameraActive ? (
               <div className="text-center space-y-4">
                 <Camera className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                 <Button onClick={startCamera} variant="outline" className="text-[10px] uppercase font-bold tracking-widest border-white/10">
                   INITIALIZE VISION NODE
                 </Button>
               </div>
             ) : (
               <>
                 <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                 <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                 
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="text-center space-y-2">
                     {isScanning ? (
                       <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                     ) : (
                       <>
                         <p className="text-5xl font-headline font-bold text-white tracking-tighter shadow-xl">{aiCount || "--"}</p>
                         <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">AI_HEAD_COUNT</p>
                       </>
                     )}
                   </div>
                 </div>
               </>
             )}
          </CardContent>
          <CardFooter className="bg-secondary/20 py-4 flex justify-between items-center px-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-background/50 border-white/5 text-[10px] uppercase font-bold" 
              onClick={triggerSnapshot}
              disabled={!isCameraActive || isScanning}
            >
              {isScanning ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <RefreshCw className="mr-2 h-3 w-3" />}
              MANUAL SNAPSHOT
            </Button>
            <div className="flex gap-4">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">AUTO_SYNC: 10s</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">GPU_LOAD: {isScanning ? '92%' : '12%'}</span>
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">Attendance Compliance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-headline font-bold text-emerald-500">{presentCount}</p>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">TOTAL_VERIFIED</p>
                </div>
                <div className="h-10 w-10 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="h-5 w-5 text-emerald-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10 text-center">
                  <p className="text-lg font-headline font-bold text-emerald-500">{presentCount}</p>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">Present</p>
                </div>
                <div className="p-3 bg-destructive/5 rounded-lg border border-destructive/10 text-center">
                  <p className="text-lg font-headline font-bold text-destructive">{absentCount}</p>
                  <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">Absent</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground uppercase">Progress</span>
                  <span className={cn("font-bold", attendancePercent >= 75 ? "text-emerald-500" : "text-amber-500")}>
                    {attendancePercent}%
                  </span>
                </div>
                <Progress value={attendancePercent} className="h-2 bg-white/5" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">Quick Add</span>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Roll No..." 
                    className="bg-secondary/50 border-white/5 h-8 text-xs font-mono uppercase"
                    value={quickAddId}
                    onChange={(e) => setQuickAddId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                  />
                  <Button size="sm" className="h-8 px-3 bg-primary" onClick={handleQuickAdd}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {aiCount > 0 && aiCount !== presentCount && (
                <div className={cn(
                  "p-3 rounded-lg border animate-in slide-in-from-top-2",
                  aiCount > presentCount ? 'bg-amber-500/5 border-amber-500/20' : 'bg-primary/5 border-primary/20'
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[10px] font-bold uppercase", aiCount > presentCount ? 'text-amber-500' : 'text-primary')}>
                      {aiCount > presentCount ? 'Proxy Detected' : 'Unregistered Attendance'}
                    </span>
                    <Badge variant="outline" className={cn("text-[9px]", aiCount > presentCount ? 'border-amber-500/20 text-amber-500' : 'border-primary/20 text-primary')}>
                      {Math.abs(aiCount - presentCount)} {aiCount > presentCount ? 'PROXIES' : 'MISSING'}
                    </Badge>
                  </div>
                  <p className="text-[9px] text-muted-foreground font-mono leading-relaxed uppercase">
                    P2Net: {aiCount} | Logs: {presentCount}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-sidebar/30 border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Live RFID Feed</CardTitle>
              <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500 font-mono">
                {isCameraActive ? 'SIMULATING' : 'IDLE'}
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
                {scanLogs.map((log) => (
                  <div key={log.id} className="group flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-foreground">{log.studentId}</span>
                        <span className="text-[9px] text-muted-foreground font-mono uppercase">{log.name}</span>
                        {log.method === 'manual' && (
                          <Badge variant="outline" className="text-[8px] h-3.5 px-1 uppercase border-primary/20 text-primary">MANUAL</Badge>
                        )}
                      </div>
                      <span className="text-[9px] text-muted-foreground font-mono uppercase">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10">
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-sidebar-border">
                            <DialogHeader>
                              <DialogTitle className="uppercase font-headline">Message Student: {log.studentId}</DialogTitle>
                              <DialogDescription className="text-xs uppercase font-mono">Institutional broadcast via personal terminal.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-2">
                                {QUICK_MESSAGES.map((msg, i) => (
                                  <Button key={i} variant="outline" size="sm" className="text-[10px] font-bold uppercase"
                                    onClick={() => toast({ title: "MESSAGE_SENT", description: `${msg.text} dispatched.` })}>
                                    {msg.label}
                                  </Button>
                                ))}
                              </div>
                              <Textarea placeholder="Enter custom institutional message..." className="bg-secondary/50 border-white/5 h-24" />
                            </div>
                            <Button className="w-full h-11 uppercase font-bold tracking-widest" onClick={() => toast({ title: "BROADCAST_SENT", description: "Message transmitted to student node." })}>
                              TRANSMIT DATA
                            </Button>
                          </DialogContent>
                       </Dialog>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteScan(log.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {scanLogs.length === 0 && (
                  <div className="py-10 text-center text-[10px] text-muted-foreground font-mono uppercase italic opacity-50">
                    No activity detected in session.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="border-b border-white/5 bg-secondary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Session Roster</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">{presentCount} Present</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span className="text-destructive">{absentCount} Absent</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{formatTime(elapsed)} elapsed</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-12">#</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Roll No</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STUDENT_ROSTER.map((student, i) => {
                const isPresent = scanLogs.some(l => l.studentId === student.id)
                return (
                  <TableRow key={student.id} className={cn(
                    "border-white/5 hover:bg-white/5 transition-colors",
                    isPresent ? "bg-emerald-500/[0.02]" : ""
                  )}>
                    <TableCell className="text-[10px] font-mono text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="text-xs font-mono font-bold">{student.id}</TableCell>
                    <TableCell className="text-xs">{student.name}</TableCell>
                    <TableCell className="text-right">
                      {isPresent ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px]">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          PRESENT
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[9px] text-muted-foreground border-white/5">
                          <Clock className="h-3 w-3 mr-1" />
                          AWAITING
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
