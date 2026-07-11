"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react"
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

const DEPARTMENTS = ["CSE", "ECE", "ME", "CE", "EEE", "AI", "Cyber Security"] as const;
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const ROLES = ["student", "faculty", "advisor", "hod"] as const;
type UserRole = typeof ROLES[number];

const registrationSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
  role: z.enum(ROLES),
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

export default function AdminRegister() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successUid, setSuccessUid] = useState<string | null>(null)

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "student",
      department: "",
      rollNumber: "",
      semester: "",
      subject: "",
      designation: "",
      assignedBatch: "",
    },
  })

  const selectedRole = form.watch("role")

  const { token } = useAuth()

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    setIsLoading(true)
    setSuccessUid(null)

    if (!token) {
      toast({ variant: "destructive", title: "AUTH_UNAVAILABLE", description: "Not authenticated." })
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role,
          department: values.department || '',
          rollNumber: values.rollNumber || '',
          semester: values.semester || '',
          subject: values.subject || '',
          designation: values.designation || '',
          assignedBatch: values.assignedBatch || '',
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create profile')
      }

      const data = await res.json()
      setSuccessUid(data.user.id)

      toast({
        title: "NODE_REGISTERED",
        description: `${values.fullName} registered as ${values.role}.`,
      })

      form.reset()
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Node Registration</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Provision new user accounts on the Edugo network.</p>
        </div>
      </div>

      {successUid && (
        <Card className="bg-emerald-500/5 border-emerald-500/20 overflow-hidden">
          <CardContent className="p-6 flex items-center gap-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-emerald-500 uppercase tracking-wider">Node Provisioned</span>
              <span className="text-[10px] font-mono text-muted-foreground">ID: {successUid}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardHeader className="border-b border-white/5 bg-secondary/10">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold uppercase tracking-wider">
              Register New {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </CardTitle>
            <Badge variant="outline" className="text-[9px] font-mono border-primary/20 text-primary uppercase ml-auto">
              {selectedRole.toUpperCase()}_NODE
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                    <FormControl><Input {...field} className="bg-secondary/50 border-white/5" placeholder="Full Name" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                    <FormControl><Input {...field} className="bg-secondary/50 border-white/5" placeholder="user@providence.edu.in" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-secondary/50 border-white/5"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {ROLES.map(r => (
                          <SelectItem key={r} value={r} className="text-xs uppercase">
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
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

              {selectedRole === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={form.control} name="rollNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Roll Number</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. CSE-23-01" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="semester" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Semester</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl><SelectTrigger className="bg-secondary/50 border-white/5"><SelectValue placeholder="Select Sem" /></SelectTrigger></FormControl>
                        <SelectContent>{SEMESTERS.map(s => <SelectItem key={s} value={s.toString()} className="text-xs">SEM {s}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="assignedBatch" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Assigned Batch</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. 2023-2027" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
              )}

              {selectedRole === "faculty" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="designation" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Designation</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Assistant Professor" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Subject</FormLabel>
                      <FormControl><Input {...field} placeholder="e.g. Data Structures" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )} />
                </div>
              )}

              {selectedRole === "advisor" && (
                <FormField control={form.control} name="assignedBatch" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Assigned Batch</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. 2023-2027" className="bg-secondary/50 border-white/5" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              )}

              {selectedRole === "hod" && (
                <FormField control={form.control} name="designation" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Designation</FormLabel>
                    <FormControl><Input {...field} placeholder="Head of Department" className="bg-secondary/50 border-white/5" /></FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />
              )}

              <Button type="submit" className="w-full h-11 font-bold group shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    PROVISION NODE
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
