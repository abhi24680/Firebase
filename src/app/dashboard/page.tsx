"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
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
  const router = useRouter()
  const { user, token, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (!token || !user) {
      router.push("/auth/login")
      return
    }

    const role: string = user.role
    router.push(ROUTES[role] || "/dashboard/admin")
  }, [token, user, loading, router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
