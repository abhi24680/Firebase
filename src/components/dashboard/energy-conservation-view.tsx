
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Lightbulb, Fan, Power, AlertTriangle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Device {
  id: string
  name: string
  type: string
  status: string
}

interface EnergyData {
  roomId: string
  roomName: string
  building: string
  capacity: number
  currentOccupancy: number
  isOccupied: boolean
  energy: {
    lightsOn: number
    totalLights: number
    fansOn: number
    totalFans: number
    autoPowerEnabled: boolean
  }
}

interface EnergyConservationViewProps {
  token: string | null
}

export function EnergyConservationView({ token }: EnergyConservationViewProps) {
  const [data, setData] = useState<EnergyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchOccupancy = async () => {
      try {
        const roomsRes = await fetch("/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const roomsData = await roomsRes.json()
        if (roomsData.rooms?.length > 0) {
          const roomId = roomsData.rooms[0].id
          const res = await fetch(`/api/rooms/${roomId}/occupancy`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          const occupancyData = await res.json()
          setData(occupancyData)
        }
      } catch (e) {
        console.error("Failed to fetch energy data:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchOccupancy()
    const interval = setInterval(fetchOccupancy, 8000)
    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Zap className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Loading energy grid...
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8 text-center space-y-4">
        <Zap className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
        <p className="text-sm font-mono uppercase text-muted-foreground">
          No energy monitoring node assigned to your terminal.
        </p>
      </div>
    )
  }

  const { energy } = data
  const allLightsOff = energy.lightsOn === 0 && energy.totalLights > 0
  const allFansOff = energy.fansOn === 0 && energy.totalFans > 0
  const isOptimal = data.isOccupied ? (energy.lightsOn > 0 || energy.fansOn > 0) : allLightsOff && allFansOff

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-sidebar/30 border-sidebar-border col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Room Occupancy
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] font-mono",
                  data.isOccupied ? "text-emerald-500 border-emerald-500/20" : "text-muted-foreground"
                )}
              >
                {data.isOccupied ? "OCCUPIED" : "EMPTY"}
              </Badge>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span
                className={cn(
                  "text-5xl font-headline font-bold",
                  data.isOccupied ? "text-emerald-500" : "text-muted-foreground"
                )}
              >
                {data.currentOccupancy}
              </span>
              <span className="text-sm text-muted-foreground font-mono mb-1">
                / {data.capacity}
              </span>
            </div>
            <Progress
              value={(data.currentOccupancy / data.capacity) * 100}
              className={cn(
                "h-2",
                data.isOccupied ? "bg-emerald-500/20" : "bg-white/5"
              )}
            />
            <div className="flex justify-between mt-2 text-[9px] font-mono text-muted-foreground">
              <span>{data.roomName}</span>
              <span>{data.building}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center border",
              energy.autoPowerEnabled
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            )}>
              <Power className={cn("h-5 w-5", energy.autoPowerEnabled ? "text-emerald-500" : "text-amber-500")} />
            </div>
            <div>
              <p className={cn("text-lg font-headline font-bold", energy.autoPowerEnabled ? "text-emerald-500" : "text-amber-500")}>
                {energy.autoPowerEnabled ? "ACTIVE" : "STANDBY"}
              </p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">
                Auto-Power System
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center border",
              isOptimal
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-amber-500/10 border-amber-500/20"
            )}>
              <CheckCircle2 className={cn("h-5 w-5", isOptimal ? "text-emerald-500" : "text-amber-500")} />
            </div>
            <div>
              <p className={cn("text-lg font-headline font-bold", isOptimal ? "text-emerald-500" : "text-amber-500")}>
                {isOptimal ? "OPTIMAL" : "WARNING"}
              </p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">
                Energy Status
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Device Status Grid
          </CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] font-mono",
              energy.autoPowerEnabled
                ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                : "text-amber-500 border-amber-500/20 bg-amber-500/5"
            )}
          >
            {energy.autoPowerEnabled ? "AUTO-OFF ENABLED" : "MANUAL MODE"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={cn(
              "p-4 rounded-xl border text-center space-y-2",
              energy.lightsOn > 0
                ? "bg-amber-500/5 border-amber-500/20"
                : "bg-white/5 border-white/5"
            )}>
              <Lightbulb className={cn("h-8 w-8 mx-auto", energy.lightsOn > 0 ? "text-amber-500" : "text-muted-foreground")} />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Lights</p>
              <p className={cn("text-lg font-bold font-mono", energy.lightsOn > 0 ? "text-amber-500" : "text-muted-foreground")}>
                {energy.lightsOn}/{energy.totalLights}
              </p>
              <p className="text-[9px] font-mono uppercase text-muted-foreground">
                {energy.lightsOn > 0 ? "ACTIVE" : "OFF"}
              </p>
            </div>

            <div className={cn(
              "p-4 rounded-xl border text-center space-y-2",
              energy.fansOn > 0
                ? "bg-cyan-500/5 border-cyan-500/20"
                : "bg-white/5 border-white/5"
            )}>
              <Fan className={cn("h-8 w-8 mx-auto", energy.fansOn > 0 ? "text-cyan-500" : "text-muted-foreground")} />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Fans</p>
              <p className={cn("text-lg font-bold font-mono", energy.fansOn > 0 ? "text-cyan-500" : "text-muted-foreground")}>
                {energy.fansOn}/{energy.totalFans}
              </p>
              <p className="text-[9px] font-mono uppercase text-muted-foreground">
                {energy.fansOn > 0 ? "ACTIVE" : "OFF"}
              </p>
            </div>

            <div className={cn(
              "p-4 rounded-xl border text-center space-y-2",
              energy.autoPowerEnabled
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-white/5 border-white/5"
            )}>
              <Power className={cn("h-8 w-8 mx-auto", energy.autoPowerEnabled ? "text-emerald-500" : "text-muted-foreground")} />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Auto-Power</p>
              <p className={cn("text-lg font-bold font-mono", energy.autoPowerEnabled ? "text-emerald-500" : "text-muted-foreground")}>
                {energy.autoPowerEnabled ? "ON" : "OFF"}
              </p>
              <p className="text-[9px] font-mono uppercase text-muted-foreground">
                {data.isOccupied ? "OCCUPIED" : "EMPTY"}
              </p>
            </div>

            <div className={cn(
              "p-4 rounded-xl border text-center space-y-2",
              isOptimal
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-amber-500/5 border-amber-500/20"
            )}>
              {isOptimal ? (
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-500" />
              ) : (
                <AlertTriangle className="h-8 w-8 mx-auto text-amber-500" />
              )}
              <p className="text-[10px] font-mono uppercase text-muted-foreground">Efficiency</p>
              <p className={cn("text-lg font-bold font-mono", isOptimal ? "text-emerald-500" : "text-amber-500")}>
                {isOptimal ? "100%" : "SUB-OPTIMAL"}
              </p>
              <p className="text-[9px] font-mono uppercase text-muted-foreground">
                {isOptimal ? "OPTIMAL" : "CHECK DEVICES"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Conservation Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Lightbulb className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase">Light Auto-Off</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Turns off all lights when room is empty
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
              ENABLED
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Fan className="h-4 w-4 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase">Fan Auto-Off</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Turns off all fans when room is empty
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono text-cyan-500 border-cyan-500/20 bg-cyan-500/5">
              ENABLED
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase">RFID Triggered Power</p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  Activates devices when first RFID tag detected
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9px] font-mono text-primary border-primary/20 bg-primary/5">
              ENABLED
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
