
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Camera, 
  FileSpreadsheet, 
  Bell, 
  Shield, 
  MessageSquare,
  Building2,
  BookOpen,
  ClipboardCheck,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavItem {
  title: string
  url: string
  icon: any
}

interface NavMainProps {
  role: 'admin' | 'hod' | 'faculty' | 'student'
}

export function NavMain({ role }: NavMainProps) {
  const pathname = usePathname()

  const navGroups: Record<string, NavItem[]> = {
    admin: [
      { title: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Departments", url: "/dashboard/admin/departments", icon: Building2 },
      { title: "HOD Management", url: "/dashboard/admin/hods", icon: Users },
      { title: "Camera Settings", url: "/dashboard/admin/camera", icon: Camera },
      { title: "System Logs", url: "/dashboard/admin/logs", icon: Shield },
    ],
    hod: [
      { title: "Live Dashboard", url: "/dashboard/hod", icon: LayoutDashboard },
      { title: "Timetable", url: "/dashboard/hod/timetable", icon: Calendar },
      { title: "Faculty", url: "/dashboard/hod/faculty", icon: Users },
      { title: "Attendance Stats", url: "/dashboard/hod/attendance", icon: ClipboardCheck },
      { title: "Leave Requests", url: "/dashboard/hod/leaves", icon: FileSpreadsheet },
    ],
    faculty: [
      { title: "Active Session", url: "/dashboard/faculty", icon: LayoutDashboard },
      { title: "My Timetable", url: "/dashboard/faculty/timetable", icon: Calendar },
      { title: "Quick Attendance", url: "/dashboard/faculty/attendance", icon: ClipboardCheck },
      { title: "Messages", url: "/dashboard/faculty/messages", icon: MessageSquare },
    ],
    student: [
      { title: "Home", url: "/dashboard/student", icon: LayoutDashboard },
      { title: "Attendance History", url: "/dashboard/student/attendance", icon: ClipboardCheck },
      { title: "Apply Leave", url: "/dashboard/student/leave", icon: FileSpreadsheet },
      { title: "Timetable", url: "/dashboard/student/timetable", icon: Calendar },
    ]
  }

  const items = navGroups[role] || []

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Navigation
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-destructive hover:text-destructive hover:bg-destructive/10">
              <Link href="/auth/login">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
