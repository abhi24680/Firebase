
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Loader2, Calendar as CalendarIcon } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const leaveSchema = z.object({
  startDate: z.string().min(1, "Required"),
  endDate: z.string().min(1, "Required"),
  reason: z.string().min(10, "Provide a more detailed reason (min 10 chars)"),
})

export function LeaveRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof leaveSchema>>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      reason: "",
    },
  })

  function onSubmit(values: z.infer<typeof leaveSchema>) {
    setIsSubmitting(true)
    console.log("Submitting Leave Node:", values)
    
    // Simulation
    setTimeout(() => {
      setIsSubmitting(false)
      form.reset()
      toast({
        title: "LEAVE_REQUEST_SENT",
        description: "Application dispatched to HOD & Advisor. Track status in Portal.",
      })
    }, 1500)
  }

  return (
    <Card className="bg-sidebar/30 border-sidebar-border">
      <CardHeader>
        <CardTitle className="text-xl font-headline uppercase tracking-tighter">Initialize Leave Request</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-secondary/50 border-white/5 font-mono" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="bg-secondary/50 border-white/5 font-mono" />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </TableHead>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Reason for Absence</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Specify your academic or personal justification..." 
                      className="bg-secondary/50 border-white/5 min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 font-bold group" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  TRANSMIT REQUEST
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center border-t border-white/5 py-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase opacity-50">
          <CalendarIcon className="h-3 w-3" />
          SYSTEM_TIME_SYNCED
        </div>
      </CardFooter>
    </Card>
  )
}
