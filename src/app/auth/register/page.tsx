
"use client"

import { useState, useEffect } from "react"
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
import { ArrowRight, Loader2, Info, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth, useFirestore } from "@/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { doc, setDoc } from "firebase/firestore"
import { toast } from "@/hooks/use-toast"

const departments = ["CSE", "ECE", "ME", "CE", "EEE", "AI", "Cyber Security"]

const baseSchema = z.object({
  fullName: z.string().min(2, "Required"),
  email: z.string().email().refine(v => v.endsWith("providence.edu.in"), "Use @providence.edu.in email"),
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
  department: z.string().min(1, "Select department"),
  rollNumber: z.string().optional(),
  semester: z.string().optional(),
  subject: z.string().optional(),
  designation: z.string().optional(),
  assignedBatch: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type UserRole = "student" | "faculty" | "hod" | "advisor";

export default function RegisterPage() {
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<UserRole>("student")
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  async function onSubmit(values: z.infer<typeof baseSchema>) {
    if (!auth || !db) {
      toast({
        variant: "destructive",
        title: "FIREBASE_UNINITIALIZED",
        description: "The authentication service is not yet ready. Please check your configuration.",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user

      const userData = {
        uid: user.uid,
        fullName: values.fullName,
        email: values.email,
        role: role,
        department: values.department,
        isApproved: role === "student", // Students auto-approved, others need manual HOD approval
        collegeName: "Providence College of Engineering",
        rollNumber: values.rollNumber || "",
        semester: values.semester || "",
        subject: values.subject || "",
        designation: values.designation || "",
        assignedBatch: values.assignedBatch || "",
        createdAt: new Date().toISOString(),
      }

      await setDoc(doc(db, "users", user.uid), userData)

      toast({
        title: "ACCOUNT_CREATED",
        description: "Node successfully registered. Proceed to login.",
      })
      
      router.push("/auth/login")
    } catch (error: any) {
      console.error("Registration Error:", error)
      let errorMessage = "Could not initialize account node."
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = "This email is already registered."
            break
          case 'auth/invalid-email':
            errorMessage = "The email address is badly formatted."
            break
          case 'auth/operation-not-allowed':
            errorMessage = "Email/Password auth is not enabled in Firebase Console."
            break
          case 'auth/weak-password':
            errorMessage = "The password is too weak."
            break
          default:
            errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "REGISTRATION_FAILED",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

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
            setRole(v as any)
            form.reset()
          }}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-secondary/50 p-1 rounded-lg">
              <TabsTrigger value="student" className="text-[10px] uppercase tracking-tighter">Student</TabsTrigger>
              <TabsTrigger value="faculty" className="text-[10px] uppercase tracking-tighter">Faculty</TabsTrigger>
              <TabsTrigger value="advisor" className="text-[10px] uppercase tracking-tighter">Advisor</TabsTrigger>
              <TabsTrigger value="hod" className="text-[10px] uppercase tracking-tighter">HOD</TabsTrigger>
            </TabsList>

            <div className="mb-6">
              {role === "student" ? (
                <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500 rounded-lg">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase tracking-wider">AUTO_APPROVAL_ACTIVE</AlertTitle>
                  <AlertDescription className="text-[10px] opacity-80 uppercase font-mono">
                    Direct access granted upon verification.
                  </AlertDescription>
                </Alert>
              ) : (
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
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">College Email</FormLabel>
                      <FormControl><Input {...field} placeholder="user@providence.edu.in" className="bg-secondary/50 border-white/5" /></FormControl>
                      <FormMessage className="text-[10px]" />
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

                <FormField control={form.control} name="department" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="bg-secondary/50 border-white/5"><SelectValue placeholder="Select Academic Unit" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {departments.map(d => <SelectItem key={d} value={d} className="text-xs uppercase">{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )} />

                {role === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <SelectContent>{[1,2,3,4,5,6,7,8].map(s => <SelectItem key={s} value={s.toString()} className="text-xs">SEM {s}</SelectItem>)}</SelectContent>
                        </Select>
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
