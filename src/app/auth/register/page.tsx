
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Loader2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const departments = ["CSE", "ECE", "ME", "CE", "EEE", "AI", "Cyber Security"]

const baseSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email().refine(v => v.endsWith("@college.edu"), "Use college email"),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  department: z.string().min(1, "Select department"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<"student" | "faculty" | "hod" | "advisor">("student")

  const form = useForm<z.infer<typeof baseSchema> & any>({
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

  function onSubmit(values: any) {
    setIsLoading(true)
    // Simulate user creation with isApproved logic
    const userData = {
      ...values,
      role,
      isApproved: role === "student", // Students are auto-approved
    }
    
    console.log("Saving user:", userData)
    
    setTimeout(() => {
      setIsLoading(false)
      // If student, go to login. If others, explain approval
      router.push("/auth/login")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(88,101,242,0.05),transparent)] pointer-events-none" />
      
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-sidebar-border relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-headline">Registration Terminal</CardTitle>
          <CardDescription>Configure your credentials for the Edugo network.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(v) => {
            setRole(v as any)
            form.reset()
          }}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-secondary h-auto py-1">
              <TabsTrigger value="student" className="text-[10px] sm:text-xs">STUDENT</TabsTrigger>
              <TabsTrigger value="faculty" className="text-[10px] sm:text-xs">FACULTY</TabsTrigger>
              <TabsTrigger value="advisor" className="text-[10px] sm:text-xs">ADVISOR</TabsTrigger>
              <TabsTrigger value="hod" className="text-[10px] sm:text-xs">HOD</TabsTrigger>
            </TabsList>

            <div className="mb-6">
              {role === "student" ? (
                <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider">Auto-Approval Active</AlertTitle>
                  <AlertDescription className="text-[10px]">
                    Student accounts are granted immediate access to the dashboard after registration.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-amber-500/5 border-amber-500/20 text-amber-500">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider">Approval Required</AlertTitle>
                  <AlertDescription className="text-[10px]">
                    Your account will require manual approval from the {role === 'hod' ? 'Admin' : 'HOD'} before console access is granted.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>College Email</FormLabel><FormControl><Input {...field} placeholder="user@college.edu" className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select Dept" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {role === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="rollNumber" render={({ field }) => (
                      <FormItem><FormLabel>Roll Number</FormLabel><FormControl><Input {...field} placeholder="e.g. CSE-23-01" className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="semester" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl><SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select Sem" /></SelectTrigger></FormControl>
                          <SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                )}

                {role === "faculty" && (
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Primary Subject</FormLabel><FormControl><Input placeholder="e.g. Data Structures" {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                {role === "advisor" && (
                  <FormField control={form.control} name="assignedBatch" render={({ field }) => (
                    <FormItem><FormLabel>Assigned Batch/Class</FormLabel><FormControl><Input placeholder="e.g. CSE 2021-25 A" {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                {role === "hod" && (
                  <FormField control={form.control} name="designation" render={({ field }) => (
                    <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g. Professor & Head" {...field} className="bg-secondary/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                <Button type="submit" className="w-full h-11 font-bold group mt-6" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <>REGISTER ACCOUNT <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
