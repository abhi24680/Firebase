
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Info, AlertTriangle, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  type: 'info' | 'alert' | 'success'
  isRead: boolean
}

export function StudentNotifications() {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Attendance Warning",
      message: "Your attendance in Computer Networks (CSE202) has fallen to 72%. Maintenance of >75% is mandatory.",
      timestamp: "2 hours ago",
      type: "alert",
      isRead: false
    },
    {
      id: "2",
      title: "Leave Authorized",
      message: "Your leave request for Oct 24 - Oct 26 has been approved by the HOD.",
      timestamp: "Yesterday",
      type: "success",
      isRead: true
    },
    {
      id: "3",
      title: "Survey Available",
      message: "New academic survey: Faculty Performance Evaluation - SEM 3 is now active.",
      timestamp: "2 days ago",
      type: "info",
      isRead: true
    }
  ]

  return (
    <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-secondary/20">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold uppercase tracking-wider">System Broadcasts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={cn(
                "p-6 transition-colors hover:bg-white/5 flex gap-4 relative",
                !n.isRead && "bg-primary/5"
              )}
            >
              {!n.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}
              
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                n.type === 'alert' ? "bg-destructive/10 border-destructive/20 text-destructive" :
                n.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                "bg-primary/10 border-primary/20 text-primary"
              )}>
                {n.type === 'alert' ? <AlertTriangle className="h-5 w-5" /> :
                 n.type === 'success' ? <ShieldCheck className="h-5 w-5" /> :
                 <Info className="h-5 w-5" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-tight">{n.title}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">{n.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <Bell className="h-12 w-12 text-muted-foreground/20 mx-auto" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">No active notifications</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
