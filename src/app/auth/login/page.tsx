
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
import { ShieldCheck, ArrowRight, Loader2, UserPlus, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { useAuth, useFirestore, useDemo, DemoRole } from "@/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { doc, getDoc } from "firebase/firestore"
const loginSchema = z.object({
  email: z.string().email("Please enter a valid college email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const ROLE_ROUTES: Record<string, string> = {
  admin: "/dashboard/admin",
  hod: "/dashboard/hod",
  faculty: "/dashboard/faculty",
  advisor: "/dashboard/advisor",
  student: "/dashboard/student",
};

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const { loginDemo } = useDemo()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
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
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password)
      const user = userCredential.user

      const userDoc = await getDoc(doc(db, "users", user.uid))
      
      if (!userDoc.exists()) {
        toast({
          variant: "destructive",
          title: "PROFILE_NOT_FOUND",
          description: "Account exists in Auth, but no academic profile was found in Firestore.",
        })
        return
      }

      const userData = userDoc.data()!
      const role = userData.role

      toast({
        title: "AUTH_SUCCESS",
        description: `Session initialized as ${role?.toUpperCase()}.`,
      })

      router.push(ROLE_ROUTES[role] || "/dashboard")

    } catch (error: any) {
      console.error("Login Error:", error)
      let errorMessage = "Invalid credentials provided."
      
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = "No node found with this email."
            break
          case 'auth/wrong-password':
            errorMessage = "Incorrect password node."
            break
          case 'auth/invalid-credential':
            errorMessage = "Invalid login credentials."
            break
          case 'auth/invalid-api-key':
            errorMessage = "Firebase API key is invalid or missing in src/firebase/config.ts."
            break
          default:
            errorMessage = error.message
        }
      }

      toast({
        variant: "destructive",
        title: "AUTH_FAILED",
        description: errorMessage,
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
                      <Input placeholder="user@providence.edu.in" {...field} className="bg-secondary/50 border-white/5 focus:border-primary/50 transition-colors" />
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

              <Button type="submit" className="w-full h-11 font-bold group mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
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
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest">New Node?</span>
            <div className="h-px bg-white/5 flex-1" />
          </div>
          <Button variant="outline" className="w-full border-white/5 hover:bg-white/5" asChild>
            <Link href="/auth/register">
              <UserPlus className="mr-2 h-4 w-4" />
              REGISTER ACCOUNT
            </Link>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dashed border-amber-500/20" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-card px-2 text-amber-500 font-mono tracking-widest">DEMO ACCESS</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['student', 'faculty', 'hod', 'advisor', 'admin'] as DemoRole[]).map((role) => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                className="border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 text-[10px] font-mono uppercase tracking-wider"
                onClick={() => { loginDemo(role); router.push(`/dashboard/${role}`); }}
              >
                {role}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-mono tracking-widest opacity-50">
            <ShieldCheck className="h-3 w-3 text-primary" />
            ENCRYPTED_AUTH_ACTIVE
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
