
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
import { ArrowRight, Loader2 } from "lucide-react"

const departments = ["CSE", "ECE", "ME", "CE", "EEE"]

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
  const [role, setRole] = useState<"student" | "faculty" | "hod">("student")

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
    },
  })

  function onSubmit(values: any) {
    setIsLoading(true)
    console.log("Registering as:", role, values)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/auth/login")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm border-sidebar-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-headline">Registration Terminal</CardTitle>
          <CardDescription>Configure your node in the Edugo network.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" onValueChange={(v) => setRole(v as any)}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-secondary">
              <TabsTrigger value="student">STUDENT</TabsTrigger>
              <TabsTrigger value="faculty">FACULTY</TabsTrigger>
              <TabsTrigger value="hod">HOD</TabsTrigger>
            </TabsList>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>College Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select Dept" /></SelectTrigger></FormControl>
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
                      <FormItem><FormLabel>Roll Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="semester" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select Sem" /></SelectTrigger></FormControl>
                          <SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                )}

                {role === "faculty" && (
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Primary Subject</FormLabel><FormControl><Input placeholder="e.g. Data Structures" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                {role === "hod" && (
                  <FormField control={form.control} name="designation" render={({ field }) => (
                    <FormItem><FormLabel>Designation</FormLabel><FormControl><Input placeholder="e.g. Professor & Head" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                )}

                <Button type="submit" className="w-full h-11 font-bold group" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : <>REGISTER FOR APPROVAL <ArrowRight className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
