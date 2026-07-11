
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Camera, Settings2, RefreshCw, Loader2, Zap } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { analyzeCrowd } from "@/ai/flows/students-count"

export default function AdminCamera() {
  const [source, setSource] = useState("laptop")
  const [rtspUrl, setRtspUrl] = useState("")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isInferenceActive, setIsInferenceActive] = useState(false)
  const [lastCount, setLastCount] = useState<number | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [isCameraActive, stream])

  const runDiagnostics = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || isInferenceActive) return

    setIsInferenceActive(true)
    const context = canvasRef.current.getContext('2d')
    if (context) {
      context.drawImage(videoRef.current, 0, 0, 640, 480)
      const dataUrl = canvasRef.current.toDataURL('image/jpeg')
      
      try {
        const result = await analyzeCrowd({ imageBuffer: dataUrl })
        setLastCount(result.count)
      } catch (error: any) {
        console.error("Inference Error:", error)
      } finally {
        setIsInferenceActive(false)
      }
    }
  }, [isInferenceActive])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCameraActive) {
      runDiagnostics()
      interval = setInterval(() => {
        runDiagnostics()
      }, 10000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCameraActive, runDiagnostics])

  const startNode = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)
      setIsCameraActive(true)
      toast({
        title: "VISION_NODE_INITIALIZED",
        description: "Automated P2Net background monitoring active.",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "CAPTURE_FAILED",
        description: "Could not initialize hardware camera node.",
      })
    }
  }

  const handleSave = () => {
    toast({
      title: "CAMERA_CONFIG_UPDATED",
      description: `Inference source switched to ${source.toUpperCase()}.`,
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Inference Infrastructure</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Configure global vision nodes and crowd-counting sources for the P2Net mesh.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="bg-secondary/20 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Source Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3">
              <Label className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">Select Infrastructure Node</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="bg-secondary/50 border-white/5 h-12 rounded-none font-bold uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-sidebar-border">
                  <SelectItem value="laptop" className="uppercase font-mono text-[10px]">LAPTOP_BUILTIN_CAM</SelectItem>
                  <SelectItem value="usb" className="uppercase font-mono text-[10px]">USB_PERIPHERAL_CAM</SelectItem>
                  <SelectItem value="mobile" className="uppercase font-mono text-[10px]">MOBILE_IP_STREAM (RTSP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {source === "mobile" && (
              <div className="space-y-3 animate-in slide-in-from-top-2">
                <Label className="text-[10px] uppercase font-mono tracking-[0.2em] text-muted-foreground">RTSP / HTTP Stream URL</Label>
                <Input 
                  placeholder="rtsp://192.168.1.100:8080/h264_ulaw.sdp" 
                  className="bg-secondary/50 border-white/5 font-mono text-xs h-11"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                />
              </div>
            )}

            <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Zap className="h-3 w-3" /> P2Net Real-time Telemetry
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <span>Network Sync Status</span>
                  <span className="text-emerald-500">OPTIMAL</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <span>Last Detected Entities</span>
                  <span className="text-white font-bold">{lastCount ?? '--'} occupants</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  <span>Inference Latency</span>
                  <span className="text-accent">452ms</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 p-8">
            <Button className="w-full bg-primary h-12 uppercase font-bold tracking-widest rounded-none shadow-lg shadow-primary/20" onClick={handleSave}>
              UPDATE SYSTEM_INFRA_NODE
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="bg-secondary/20 flex flex-row items-center justify-between border-b border-white/5">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Node Preview Feed</CardTitle>
            <Badge variant="outline" className={`font-mono uppercase text-[9px] ${isCameraActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse' : 'text-muted-foreground'}`}>
              {isCameraActive ? 'NODE_ACTIVE' : 'NODE_OFFLINE'}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 aspect-video relative flex items-center justify-center bg-black/40 group overflow-hidden">
            {!isCameraActive ? (
              <div className="flex flex-col items-center gap-6 relative z-10 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary/50 flex items-center justify-center border border-white/5">
                  <Camera className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Inference Node Idle</p>
                  <p className="text-[10px] text-muted-foreground/40 font-mono uppercase">ID: PRC-CAM-7281</p>
                </div>
                <Button variant="outline" size="lg" className="bg-secondary/50 border-white/5 font-bold uppercase tracking-widest text-[10px] rounded-none px-8" onClick={startNode}>
                  INITIALIZE FEED
                </Button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
                {isInferenceActive && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Inference in progress...</span>
                  </div>
                )}
                {lastCount !== null && !isInferenceActive && (
                  <div className="absolute bottom-8 right-8 bg-primary/80 backdrop-blur-xl px-5 py-2 rounded-lg text-white shadow-2xl">
                    <p className="text-[8px] font-mono uppercase tracking-[0.2em] opacity-60">Detected Entities</p>
                    <p className="font-bold text-3xl font-headline leading-none">{lastCount}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="bg-secondary/20 py-6 flex justify-between items-center px-8 border-t border-white/5">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${isCameraActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-destructive'}`} />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Node Stability: {isCameraActive ? 'Optimal' : 'Offline'}</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-[10px] uppercase font-bold tracking-widest rounded-none border-white/10 hover:bg-white/5 h-10 px-6" 
              onClick={runDiagnostics}
              disabled={!isCameraActive || isInferenceActive}
            >
              {isInferenceActive ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <RefreshCw className="h-3 w-3 mr-2" />}
              MANUAL_RESCAN
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
