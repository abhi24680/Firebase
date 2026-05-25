
"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, XCircle, Clock, User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ScanEvent {
  id: string
  studentName: string
  rollNo: string
  status: 'present' | 'absent' | 'pending'
  timestamp: string
}

export function LiveScanLog() {
  const [scans, setScans] = useState<ScanEvent[]>([
    { id: '1', studentName: 'John Doe', rollNo: 'CSE2023-01', status: 'present', timestamp: '10:01:45 AM' },
    { id: '2', studentName: 'Alice Smith', rollNo: 'CSE2023-45', status: 'present', timestamp: '10:02:12 AM' },
    { id: '3', studentName: 'Bob Wilson', rollNo: 'CSE2023-12', status: 'pending', timestamp: '10:03:01 AM' },
  ])

  // Simulate incoming WebSocket events
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Charlie Brown', 'David Lee', 'Emma Watson', 'Frank Castle', 'Grace Hopper']
      const newScan: ScanEvent = {
        id: Math.random().toString(),
        studentName: names[Math.floor(Math.random() * names.length)],
        rollNo: `CSE2023-${Math.floor(Math.random() * 100)}`,
        status: 'present',
        timestamp: new Date().toLocaleTimeString()
      }
      setScans(prev => [newScan, ...prev].slice(0, 10))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="h-full bg-sidebar/50 border-sidebar-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Live RFID Activity
        </CardTitle>
        <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
          Live Connection
        </Badge>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-1">
          {scans.map((scan) => (
            <div 
              key={scan.id} 
              className="flex items-center gap-4 px-4 py-3 hover:bg-accent/5 transition-colors border-l-4 border-l-transparent hover:border-l-primary"
            >
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
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
                {scan.status === 'present' ? (
                  <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                    Marked
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/5">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
