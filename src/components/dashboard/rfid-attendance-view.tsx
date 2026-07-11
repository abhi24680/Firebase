
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Radio, Users, AlertTriangle, CheckCircle2, Clock, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScanEvent {
  id: string
  studentName: string
  rollNo: string
  cardId: string
  method: string
  timestamp: string
}

interface RoomData {
  id: string
  name: string
  building: string
  capacity: number
  currentOccupancy: number
  devices: { id: string; name: string; type: string; status: string }[]
  totalScans: number
}

interface RfidAttendanceViewProps {
  token: string | null
}

export function RfidAttendanceView({ token }: RfidAttendanceViewProps) {
  const [room, setRoom] = useState<RoomData | null>(null)
  const [scans, setScans] = useState<ScanEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [peopleCount, setPeopleCount] = useState(0)

  useEffect(() => {
    if (!token) return

    const fetchRoom = async () => {
      try {
        const res = await fetch("/api/rooms", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.rooms?.length > 0) {
          setRoom(data.rooms[0])
          setPeopleCount(data.rooms[0].currentOccupancy)
        }
      } catch (e) {
        console.error("Failed to fetch rooms:", e)
      } finally {
        setLoading(false)
      }
    }

    const fetchScans = async () => {
      try {
        const res = await fetch(`/api/rfid-scans?limit=15`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setScans(
          (data.scans || []).map((s: any) => ({
            id: s.id,
            studentName: s.user.fullName,
            rollNo: s.user.rollNumber,
            cardId: s.cardId,
            method: s.method,
            timestamp: new Date(s.timestamp).toLocaleTimeString(),
          }))
        )
      } catch (e) {
        console.error("Failed to fetch scans:", e)
      }
    }

    fetchRoom()
    fetchScans()
    const interval = setInterval(() => {
      fetchRoom()
      fetchScans()
    }, 5000)

    return () => clearInterval(interval)
  }, [token])

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Radio className="h-8 w-8 animate-pulse text-primary" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Scanning RFID infrastructure...
          </p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="p-8 text-center space-y-4">
        <Radio className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
        <p className="text-sm font-mono uppercase text-muted-foreground">
          No RFID reader node assigned to your terminal.
        </p>
      </div>
    )
  }

  const occupancyPercent = Math.round((peopleCount / room.capacity) * 100)
  const occupancyColor = occupancyPercent >= 80 ? "text-amber-500" : occupancyPercent > 0 ? "text-emerald-500" : "text-muted-foreground"
  const isRoomEmpty = peopleCount === 0

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-sidebar/30 border-sidebar-border col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                People In Room
              </span>
              <Badge variant="outline" className={cn("text-[9px] font-mono", occupancyColor)}>
                {occupancyPercent}%
              </Badge>
            </div>
            <div className="flex items-end gap-3 mb-3">
              <span className={cn("text-5xl font-headline font-bold", occupancyColor)}>
                {peopleCount}
              </span>
              <span className="text-sm text-muted-foreground font-mono mb-1">
                / {room.capacity}
              </span>
            </div>
            <Progress
              value={occupancyPercent}
              className={cn(
                "h-2",
                occupancyPercent >= 80 ? "bg-amber-500/20" : occupancyPercent > 0 ? "bg-emerald-500/20" : "bg-white/5"
              )}
            />
            <div className="flex justify-between mt-2 text-[9px] font-mono text-muted-foreground">
              <span>{room.name}</span>
              <span>{room.building}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center border",
              isRoomEmpty
                ? "bg-muted/10 border-muted/20"
                : "bg-emerald-500/10 border-emerald-500/20"
            )}>
              <Wifi className={cn("h-5 w-5", isRoomEmpty ? "text-muted-foreground" : "text-emerald-500")} />
            </div>
            <div>
              <p className={cn("text-lg font-headline font-bold", isRoomEmpty ? "text-muted-foreground" : "text-emerald-500")}>
                {isRoomEmpty ? "STANDBBY" : "ACTIVE"}
              </p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">
                RFID Reader Status
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-headline font-bold text-primary">{room.totalScans}</p>
              <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">
                Total Scans Today
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Live RFID Scan Feed
          </CardTitle>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse mr-1.5" />
            Live
          </Badge>
        </CardHeader>
        <CardContent className="px-0">
          {scans.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Radio className="h-8 w-8 text-muted-foreground mx-auto opacity-20 mb-2" />
              <p className="text-[10px] font-mono uppercase text-muted-foreground">
                Waiting for RFID scan events...
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent/5 transition-colors border-l-4 border-l-transparent hover:border-l-primary"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{scan.studentName}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono uppercase">{scan.rollNo}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-mono">
                      <Clock className="h-3 w-3" />
                      {scan.timestamp}
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-mono",
                        scan.method === "rfid"
                          ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                          : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                      )}
                    >
                      {scan.method.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {room.devices.length > 0 && (
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Room Device Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {room.devices.map((device) => (
                <div
                  key={device.id}
                  className={cn(
                    "p-3 rounded-lg border text-center",
                    device.status === "on"
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-white/5 border-white/5"
                  )}
                >
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">{device.name}</p>
                  <p
                    className={cn(
                      "text-sm font-bold font-mono mt-1",
                      device.status === "on" ? "text-emerald-500" : "text-muted-foreground"
                    )}
                  >
                    {device.status.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
