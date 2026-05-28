
"use client"

import { useState } from "react"
import { Camera, Laptop, Usb, Smartphone, Radio, Settings2, RefreshCw } from "lucide-react"
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

export default function AdminCamera() {
  const [source, setSource] = useState("laptop")
  const [rtspUrl, setRtspUrl] = useState("")

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
        <p className="text-muted-foreground">Configure global vision nodes and crowd-counting sources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Source Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Select Global Input Node</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="bg-secondary/50 border-white/5 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-sidebar-border">
                  <SelectItem value="laptop">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" />
                      <span>LAPTOP_BUILTIN_CAM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="usb">
                    <div className="flex items-center gap-2">
                      <Usb className="h-4 w-4" />
                      <span>USB_PERIPHERAL_CAM</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="mobile">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>MOBILE_IP_STREAM (RTSP)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {source === "mobile" && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <Label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">RTSP / HTTP Stream URL</Label>
                <Input 
                  placeholder="rtsp://192.168.1.100:8080/h264_ulaw.sdp" 
                  className="bg-secondary/50 border-white/5 font-mono text-sm"
                  value={rtspUrl}
                  onChange={(e) => setRtspUrl(e.target.value)}
                />
                <p className="text-[9px] text-muted-foreground font-mono italic">
                  Note: Mobile node must be on the same local network as the compute cluster.
                </p>
              </div>
            )}

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                <Radio className="h-3 w-3" /> System Diagnostics
              </h4>
              <ul className="space-y-1 text-[10px] font-mono text-muted-foreground">
                <li className="flex justify-between"><span>LINK_STABILITY</span> <span className="text-emerald-500">EXCELLENT</span></li>
                <li className="flex justify-between"><span>INFERENCE_LATENCY</span> <span>12.4ms</span></li>
                <li className="flex justify-between"><span>FRAME_BUFFER</span> <span>SYNCED</span></li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-6">
            <Button className="w-full bg-primary" onClick={handleSave}>
              UPDATE SYSTEM SOURCE
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
          <CardHeader className="bg-secondary/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">Infrastructure Preview</CardTitle>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-mono animate-pulse uppercase">
              FEED_ACTIVE
            </Badge>
          </CardHeader>
          <CardContent className="p-0 aspect-video relative flex items-center justify-center bg-black/40 group cursor-pointer">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_100%)]" />
            <div className="flex flex-col items-center gap-4 relative z-10 text-center">
              <Camera className="h-12 w-12 text-muted-foreground opacity-20" />
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Initializing Vision Node...</p>
                <p className="text-[10px] text-muted-foreground/60 font-mono">Source: {source.toUpperCase()}</p>
              </div>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-white/5 mt-4">
                <RefreshCw className="mr-2 h-3 w-3" />
                REBOOT FEED
              </Button>
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/20 py-4 flex justify-between items-center px-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">FPS: 24.0</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase">RES: 1080P</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">NODE_ID: CAM-7281-PRC</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
