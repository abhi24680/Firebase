"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const schema = z.object({
  password: z.string().min(6, "At least 6 characters"),
  confirmPassword: z.string().min(6, "At least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
    })
  }, [])

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: values.password })
      if (error) throw new Error(error.message)
      setDone(true)
      toast({ title: "PASSWORD_UPDATED", description: "You can now log in with your new password." })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "UPDATE_FAILED",
        description: error.message || "Could not update password.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-sidebar-border">
          <CardHeader className="text-center">
            <Logo size="md" />
            <CardTitle className="text-xl font-headline font-bold uppercase tracking-tighter mt-4">Invalid Link</CardTitle>
            <CardDescription>This reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-white/5 hover:bg-white/5" asChild>
              <Link to="/auth/forgot-password">REQUEST NEW LINK</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <Card className="w-full max-w-md bg-card/50 backdrop-blur-sm border-sidebar-border relative z-10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tighter">New Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <div className="space-y-4">
              <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription className="text-xs uppercase font-mono">
                  Password updated successfully.
                </AlertDescription>
              </Alert>
              <Button className="w-full h-11 font-bold shadow-lg shadow-primary/20" onClick={() => navigate("/auth/login")}>
                PROCEED TO LOGIN <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? "text" : "password"} {...field} className="bg-secondary/50 border-white/5 pr-10" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} {...field} className="bg-secondary/50 border-white/5" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-11 font-bold group mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>UPDATE PASSWORD <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
