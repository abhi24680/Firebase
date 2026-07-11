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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Loader2, Info, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EEE", "AI", "Cyber Security"] as const;
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const ROLES = ["student", "faculty", "advisor", "hod", "admin"] as const;
type UserRole = typeof ROLES[number];

const baseSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email(),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
  department: z.string().optional(),
  rollNumber: z.string().optional(),
  semester: z.string().optional(),
  subject: z.string().optional(),
  designation: z.string().optional(),
  assignedBatch: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const ROLE_ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  hod: "/dashboard/hod",
  faculty: "/dashboard/faculty",
  advisor: "/dashboard/advisor",
  student: "/dashboard/student",
};

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("student")
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      department: "",
      rollNumber: "",
      semester: "",
      subject: "",
      designation: "",
      assignedBatch: "",
    },
  })

  const { register } = useAuth()

  async function onSubmit(values: z.infer<typeof baseSchema>) {
    setIsLoading(true)

    const RESTRICTED_DOMAIN = "@student.providence.edu.in"
    const localPart = values.email.split("@")[0]?.toLowerCase() || ""
    if (role !== "admin" && !values.email.endsWith(RESTRICTED_DOMAIN) && localPart !== "admin") {
      toast({ variant: "destructive", title: "REGISTRATION_FAILED", description: "Non-admin accounts must use @student.providence.edu.in email." })
      setIsLoading(false)
      return
    }

    try {
      const result = await register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role,
        department: values.department || '',
        rollNumber: values.rollNumber || '',
        semester: values.semester || '',
        subject: values.subject || '',
        designation: values.designation || '',
        assignedBatch: values.assignedBatch || '',
      })

      if (result.needsEmailConfirmation) {
        toast({
          title: "EMAIL_VERIFICATION_REQUIRED",
          description: "Account created. Check your email to confirm before logging in.",
        })
      } else {
        toast({
          title: "ACCOUNT_CREATED",
          description: "Node successfully registered. Redirecting to dashboard.",
        })
        router.push(ROLE_ROUTES[role] || "/dashboard")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "REGISTRATION_FAILED",
        description: error.message || "Could not initialize account node.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-sidebar-border relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tighter">Node Registration</CardTitle>
          <CardDescription>Configure your identity on the Edugo network.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="student" onValueChange={(v) => {
            setRole(v as UserRole)
            form.reset()
          }}>
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-secondary/50 p-1 rounded-lg">
              {ROLES.map(r => (
                <TabsTrigger key={r} value={r} className="text-[10px] uppercase tracking-tighter">
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mb-6">
              {role === "student" || role === "admin" ? null : (
                <Alert className="bg-amber-500/5 border-amber-500/20 text-amber-500 rounded-lg">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider">VALIDATION_REQUIRED</AlertTitle>
                  <AlertDescription className="text-[10px] opacity-80 uppercase font-mono">
                    Manual authorization required from {role === 'hod' ? 'Admin' : 'HOD'}.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                      <FormControl><Input {...field} className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">{role === "admin" ? "Email" : "College Email"}</FormLabel>
                      <FormControl><Input {...field} placeholder="yourname@student.providence.edu.in" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                      {role !== "admin" && <p className="text-[8px] font-mono text-muted-foreground/60">Must end with @student.providence.edu.in</p>}
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            {...field} 
                            className="bg-secondary/50 border-white/5 pr-10" 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} {...field} className="bg-secondary/50 border-white/5" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>

                {role !== "admin" && (
                  <FormField control={form.control} name="department" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/5"><SelectValue placeholder="Select Academic Unit" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="text-xs uppercase">{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                )}

                {role === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="rollNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Roll Number</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. CSE-23-01" className="bg-secondary/50 border-white/5" /></FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )} />
                  </div>
                )}

                <Button type="submit" className="w-full h-11 font-bold group mt-6 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>INITIALIZE ACCOUNT <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/5 py-4 flex flex-col gap-4">
          <p className="text-[10px] text-muted-foreground uppercase font-mono">
            Already have a node? <Link href="/auth/login" className="text-primary hover:underline font-bold">LOGIN HERE</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
