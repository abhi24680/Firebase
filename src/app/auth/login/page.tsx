
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
import { ShieldCheck, ArrowRight, Loader2, UserPlus } from "lucide-react"
import Link from "next/link"

const loginSchema = z.object({
  email: z.string().email("Invalid email").refine(
    (val) => val.endsWith("@college.edu"),
    "Only @college.edu emails are allowed"
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true)
    // Simulate auth logic
    setTimeout(() => {
      setIsLoading(false)
      // Redirect to dashboard (middleware would handle role-based routing)
      router.push("/dashboard")
    }, 1500)
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
          <CardTitle className="text-2xl font-headline font-bold">Terminal Login</CardTitle>
          <CardDescription>
            Enter your academic credentials to access your dashboard.
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
                    <FormLabel>College Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@college.edu" {...field} className="bg-secondary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="bg-secondary/50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 font-bold group" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    LOGIN
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button variant="outline" className="w-full border-sidebar-border" asChild>
            <Link href="/auth/register">
              <UserPlus className="mr-2 h-4 w-4" />
              CREATE ACCOUNT
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase font-mono tracking-widest">
            <ShieldCheck className="h-3 w-3 text-primary" />
            Encrypted Authentication Node
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
