
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Camera, 
  FileSpreadsheet, 
  Shield, 
  MessageSquare,
  Building2,
  ClipboardCheck,
  LogOut,
  UserCheck,
  Activity,
  History,
  GraduationCap,
  ClipboardList,
  FileText
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
  role: 'admin' | 'hod' | 'faculty' | 'student' | 'advisor'
}

export function NavMain({ role }: NavMainProps) {
  const pathname = usePathname()

  const navGroups: Record<string, NavItem[]> = {
    admin: [
      { title: "System Health", url: "/dashboard/admin", icon: Activity },
      { title: "HOD Approvals", url: "/dashboard/admin/approvals", icon: UserCheck },
      { title: "Departments", url: "/dashboard/admin/departments", icon: Building2 },
      { title: "Global Logs", url: "/dashboard/admin/logs", icon: Shield },
      { title: "Infrastructure", url: "/dashboard/admin/camera", icon: Camera },
    ],
    hod: [
      { title: "Dept Dashboard", url: "/dashboard/hod", icon: LayoutDashboard },
      { title: "Faculty Approvals", url: "/dashboard/hod/approvals", icon: UserCheck },
      { title: "Timetable Editor", url: "/dashboard/hod/timetable", icon: Calendar },
      { title: "Subject Mapping", url: "/dashboard/hod/mapping", icon: Building2 },
      { title: "Messages", url: "/dashboard/hod/messages", icon: MessageSquare },
      { title: "All Attendance", url: "/dashboard/hod/attendance", icon: ClipboardCheck },
    ],
    advisor: [
      { title: "Batch Overview", url: "/dashboard/advisor", icon: LayoutDashboard },
      { title: "Student Directory", url: "/dashboard/advisor/students", icon: Users },
      { title: "Batch Attendance", url: "/dashboard/advisor/attendance", icon: ClipboardCheck },
      { title: "Performance", url: "/dashboard/advisor/performance", icon: Activity },
      { title: "Communications", url: "/dashboard/advisor/messages", icon: MessageSquare },
    ],
    faculty: [
      { title: "Active Session", url: "/dashboard/faculty", icon: Activity },
      { title: "Quick Attendance", url: "/dashboard/faculty/attendance", icon: ClipboardCheck },
      { title: "My Timetable", url: "/dashboard/faculty/timetable", icon: Calendar },
      { title: "Student History", url: "/dashboard/faculty/history", icon: History },
      { title: "Reports", url: "/dashboard/faculty/reports", icon: FileSpreadsheet },
    ],
    student: [
      { title: "My Terminal", url: "/dashboard/student", icon: LayoutDashboard },
      { title: "Attendance Logs", url: "/dashboard/student", icon: ClipboardCheck },
      { title: "Leave Portal", url: "/dashboard/student", icon: FileText },
      { title: "Active Surveys", url: "/dashboard/student", icon: ClipboardList },
    ]
  }

  const items = navGroups[role] || []

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Terminal Access
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item, idx) => (
            <SidebarMenuItem key={`${item.url}-${idx}`}>
              <SidebarMenuButton asChild isActive={pathname === item.url && idx === 0}>
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
                <span>Terminate Session</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  )
}
