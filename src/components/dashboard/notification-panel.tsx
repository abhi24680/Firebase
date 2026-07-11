
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  severity: string
  read: boolean
  metadata: string | null
  createdAt: string
}

interface NotificationPanelProps {
  token: string | null
  role: "hod" | "advisor"
}

export function NotificationPanel({ token, role }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    if (!token) return
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

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 5000)
    return () => clearInterval(interval)
  }, [token])

  const markAllRead = async () => {
    if (!token) return
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ readAll: true }),
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (e) {
      console.error("Failed to mark notifications:", e)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "high": return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "medium": return <Info className="h-4 w-4 text-primary" />
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20"
      case "high": return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "medium": return "bg-primary/10 text-primary border-primary/20"
      default: return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    }
  }

  return (
    <Card className="bg-sidebar/30 border-sidebar-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold uppercase tracking-wider">
            {role === "hod" ? "Department" : "Batch"} Notifications
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-mono text-[9px] animate-pulse">
              {unreadCount} NEW
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[9px] font-mono uppercase"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            Mark All Read
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 text-center">
            <Bell className="h-6 w-6 text-muted-foreground mx-auto animate-pulse opacity-20" />
            <p className="text-[10px] font-mono uppercase text-muted-foreground mt-2">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto opacity-20 mb-2" />
            <p className="text-[10px] font-mono uppercase text-muted-foreground">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 hover:bg-accent/5 transition-colors",
                  !notif.read && "bg-accent/5 border-l-2 border-l-primary"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getSeverityIcon(notif.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold uppercase truncate">{notif.title}</p>
                    <Badge
                      variant="outline"
                      className={cn("text-[8px] font-mono shrink-0", getSeverityBadge(notif.severity))}
                    >
                      {notif.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                    {notif.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[8px] font-mono text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
