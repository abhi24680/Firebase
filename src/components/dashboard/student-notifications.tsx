
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Info, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  severity: string
  read: boolean
  createdAt: string
}

export function StudentNotifications() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications?limit=20", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } catch (e) {
        console.error("Failed to fetch notifications:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 8000)
    return () => clearInterval(interval)
  }, [token])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-5 w-5" />
      case "high": return <AlertTriangle className="h-5 w-5" />
      case "medium": return <Info className="h-5 w-5" />
      default: return <CheckCircle2 className="h-5 w-5" />
    }
  }

  const getSeverityColors = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive/10 border-destructive/20 text-destructive"
      case "high": return "bg-amber-500/10 border-amber-500/20 text-amber-500"
      case "medium": return "bg-primary/10 border-primary/20 text-primary"
      default: return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
    }
  }

  if (loading) {
    return (
      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-secondary/20">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary animate-pulse" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">System Broadcasts</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Bell className="h-6 w-6 text-muted-foreground mx-auto animate-pulse opacity-20" />
          <p className="text-[10px] font-mono uppercase text-muted-foreground mt-2">
            Loading notifications...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">System Broadcasts</CardTitle>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-mono text-[9px] animate-pulse">
              {unreadCount} UNREAD
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "p-6 transition-colors hover:bg-white/5 flex gap-4 relative",
                !n.read && "bg-primary/5"
              )}
            >
              {!n.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              )}

              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                getSeverityColors(n.severity)
              )}>
                {getSeverityIcon(n.severity)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold uppercase tracking-tight">{n.title}</h4>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
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
