"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  hod: "/dashboard/hod",
  faculty: "/dashboard/faculty",
  advisor: "/dashboard/advisor",
  student: "/dashboard/student",
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, token, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!token || !user) {
      navigate("/auth/login")
      return
    }

    const role: string = user.role
    navigate(ROUTES[role] || "/dashboard/admin")
  }, [token, user, loading, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
