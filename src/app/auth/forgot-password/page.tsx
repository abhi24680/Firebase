"use client"

import { useState } from "react"
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
import { ArrowRight, Loader2, MailCheck, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
})

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [email, setEmail] = useState("")

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    setIsLoading(true)
    setEmail(values.email)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw new Error(error.message)
      setSent(true)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "RESET_FAILED",
        description: error.message || "Could not send reset link.",
      })
    } finally {
      setIsLoading(false)
    }
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
          <CardTitle className="text-2xl font-headline font-bold uppercase tracking-tighter">Password Recovery</CardTitle>
          <CardDescription>Enter your email to receive a reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4">
              <Alert className="bg-emerald-500/5 border-emerald-500/20 text-emerald-500">
                <MailCheck className="h-4 w-4" />
                <AlertDescription className="text-xs uppercase font-mono">
                  Reset link sent to <strong>{email}</strong>. Check your inbox.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full border-white/5 hover:bg-white/5" asChild>
                <Link to="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  BACK TO LOGIN
                </Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="yourname@student.providence.edu.in" {...field} className="bg-secondary/50 border-white/5" />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-11 font-bold group mt-4 shadow-lg shadow-primary/20" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <>SEND RESET LINK <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
                </Button>

                <Button variant="ghost" className="w-full text-muted-foreground" asChild>
                  <Link to="/auth/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    BACK TO LOGIN
                  </Link>
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
