
"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useUser, useDoc, useFirestore } from "@/firebase"
import { doc } from "firebase/firestore"

export default function DashboardPage() {
  const router = useRouter()
  const db = useFirestore()
  const { user, loading: authLoading } = useUser()

  const userDocRef = useMemo(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])

  const { data: profile, loading: profileLoading } = useDoc(userDocRef)

  useEffect(() => {
    if (authLoading || profileLoading) return
    if (!user) {
      router.push("/auth/login")
      return
    }
    const role = (profile as any)?.role || "student"
    const routes: Record<string, string> = {
      admin: "/dashboard/admin",
      hod: "/dashboard/hod",
      faculty: "/dashboard/faculty",
      advisor: "/dashboard/advisor",
      student: "/dashboard/student",
    }
    router.push(routes[role] || "/dashboard/admin")
  }, [user, profile, authLoading, profileLoading, router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}
