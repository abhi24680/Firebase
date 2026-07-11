"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ShieldCheck, ArrowRight, Loader2, UserPlus, Eye, EyeOff, GraduationCap, Users, BookOpen, LayoutDashboard, UserCog } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

  const loginSchema = z.object({
    email: z.string().email("Please enter a valid college email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })

  const RESTRICTED_DOMAIN = "@student.providence.edu.in"

const ROLE_ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  hod: "/dashboard/hod",
  faculty: "/dashboard/faculty",
  advisor: "/dashboard/advisor",
  student: "/dashboard/student",
};

export default function LoginPage() {
  const router = useRouter()
  const { login, demoLogin, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const DEMO_ACCOUNTS = [
    { role: "admin", label: "Admin", icon: LayoutDashboard, name: "Dr. Admin", dept: "CSE", color: "text-red-500", border: "border-red-500/20 hover:border-red-500/40" },
    { role: "hod", label: "HOD", icon: UserCog, name: "Dr. HOD", dept: "CSE", color: "text-purple-500", border: "border-purple-500/20 hover:border-purple-500/40" },
    { role: "faculty", label: "Faculty", icon: BookOpen, name: "Dr. Faculty", dept: "CSE", color: "text-blue-500", border: "border-blue-500/20 hover:border-blue-500/40" },
    { role: "advisor", label: "Advisor", icon: Users, name: "Prof. Advisor", dept: "CSE", color: "text-amber-500", border: "border-amber-500/20 hover:border-amber-500/40" },
    { role: "student", label: "Student", icon: GraduationCap, name: "Demo Student", dept: "CSE", color: "text-emerald-500", border: "border-emerald-500/20 hover:border-emerald-500/40", roll: "CSE23-099", sem: "3" },
  ]

  function handleDemoLogin(account: typeof DEMO_ACCOUNTS[number]) {
    demoLogin({
      role: account.role,
      fullName: account.name,
      email: `${account.role}@demo.edu`,
      department: account.dept,
      rollNumber: account.role === "student" ? "CSE23-099" : undefined,
      semester: account.role === "student" ? "3" : undefined,
    })
    toast({ title: `DEMO_MODE_ACTIVE`, description: `Logged in as ${account.label}.` })
    router.push(`/dashboard/${account.role}`)
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)

    try {
      const userData = await login(values.email, values.password)

      if (userData.role !== "admin" && !values.email.endsWith(RESTRICTED_DOMAIN)) {
        await logout()
        toast({ variant: "destructive", title: "AUTH_FAILED", description: "Non-admin accounts must use a @student.providence.edu.in email." })
        return
      }

      toast({
        title: "AUTH_SUCCESS",
        description: `Session initialized as ${userData?.role?.toUpperCase()}.`,
      })
      router.push(ROLE_ROUTES[userData?.role] || "/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "AUTH_FAILED",
        description: error.message || "Invalid credentials provided.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-72 h-72 bg-accent/10 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-sidebar-border relative z-10">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tighter">Terminal Access</CardTitle>
          <CardDescription>
            Authenticate with academic or admin credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">ID / College Email</FormLabel>
                    <FormControl>
                      <Input placeholder="yourname@student.providence.edu.in" {...field} className="bg-secondary/50 border-white/5 focus:border-primary/50 transition-colors" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          {...field} 
                          className="bg-secondary/50 border-white/5 focus:border-primary/50 transition-colors pr-10" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-[10px] text-muted-foreground hover:text-primary uppercase font-mono tracking-widest transition-colors">
                  FORGOT PASSWORD?
                </Link>
              </div>

              <Button type="submit" className="w-full h-11 font-bold group shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    SECURE LOGIN
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">Demo Access</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>
          <div className="grid grid-cols-5 gap-2 w-full">
            {DEMO_ACCOUNTS.map((acc) => (
              <Button
                key={acc.role}
                variant="outline"
                className={`flex flex-col items-center gap-1 h-auto py-3 px-1 border ${acc.border} hover:bg-white/5`}
                onClick={() => handleDemoLogin(acc)}
              >
                <acc.icon className={`h-4 w-4 ${acc.color}`} />
                <span className={`text-[8px] uppercase font-bold ${acc.color}`}>{acc.label}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full">
            <div className="h-px bg-white/5 flex-1" />
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">New Node?</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>
          <Button variant="outline" className="w-full border-white/5 hover:bg-white/5" asChild>
            <Link href="/auth/register">
              <UserPlus className="mr-2 h-4 w-4" />
              REGISTER ACCOUNT
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-mono tracking-widest opacity-50">
            <ShieldCheck className="h-3 w-3 text-primary" />
            ENCRYPTED_AUTH_ACTIVE
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
