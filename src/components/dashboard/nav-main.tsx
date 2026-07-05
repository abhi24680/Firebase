
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Camera, 
  FileSpreadsheet, 
  Building2,
  ClipboardCheck,
  LogOut,
  Activity,
  History,
  GraduationCap,
  Settings,
  ShieldCheck,
  Send,
  Link as LinkIcon,
  UserCog
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

const NAV_GROUPS: Record<string, NavItem[]> = {
  admin: [
    { title: "System Health", url: "/dashboard/admin", icon: Activity },
    { title: "Departments", url: "/dashboard/admin/departments", icon: Building2 },
    { title: "HOD Management", url: "/dashboard/admin/hods", icon: ShieldCheck },
    { title: "Student Directory", url: "/dashboard/admin/students", icon: Users },
    { title: "Inference Node", url: "/dashboard/admin/camera", icon: Camera },
    { title: "System Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
  hod: [
    { title: "Dept Overview", url: "/dashboard/hod", icon: LayoutDashboard },
    { title: "Validation Queue", url: "/dashboard/hod/approvals", icon: ShieldCheck },
    { title: "Master Timetable", url: "/dashboard/hod/timetable", icon: Calendar },
    { title: "Subject Mapping", url: "/dashboard/hod/mapping", icon: LinkIcon },
    { title: "Faculty Hub", url: "/dashboard/hod/faculty", icon: UserCog },
    { title: "Student Hub", url: "/dashboard/hod/students", icon: GraduationCap },
    { title: "Attendance Logs", url: "/dashboard/hod/attendance", icon: ClipboardCheck },
  ],
  advisor: [
    { title: "Batch Overview", url: "/dashboard/advisor", icon: LayoutDashboard },
    { title: "Batch Students", url: "/dashboard/advisor/students", icon: Users },
    { title: "Batch Attendance", url: "/dashboard/advisor/attendance", icon: ClipboardCheck },
    { title: "Timetable", url: "/dashboard/advisor/timetable", icon: Calendar },
    { title: "Leave Requests", url: "/dashboard/advisor/leaves", icon: Send },
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
  ]
};

export function NavMain({ role }: NavMainProps) {
  const pathname = usePathname()

  const items = NAV_GROUPS[role] || []

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
          Terminal Access
        </SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item, idx) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={`${item.url}-${idx}`}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.url}>
                    <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "")} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
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
