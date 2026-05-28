
"use client"

import { useState } from "react"
import { Send, CheckCircle2, XCircle, Info, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

export default function AdvisorLeaves() {
  const [leaves, setLeaves] = useState([
    { id: "1", student: "Leo Das", roll: "CSE23CA045", dates: "Oct 28 - Oct 30", reason: "Participating in inter-college tech fest.", status: "PENDING" },
    { id: "2", student: "Sarah Miller", roll: "CSE23CA012", dates: "Oct 25 - Oct 25", reason: "Medical appointment for routine checkup.", status: "PENDING" },
  ])

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setLeaves(prev => prev.filter(l => l.id !== id))
    toast({
      title: action === 'APPROVE' ? "LEAVE_AUTHORIZED" : "LEAVE_REJECTED",
      description: "Decision transmitted to student terminal.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Batch Leave Queue</h1>
        <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Faculty Advisor Coordination Node</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaves.map((l) => (
          <Card key={l.id} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="text-primary border-primary/20 text-[9px] font-mono">ADVISOR_REVIEW</Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <Calendar className="h-3 w-3" />
                  {l.dates}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase">{l.student}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{l.roll}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-secondary/30 rounded border border-white/5">
                <p className="text-xs text-muted-foreground italic">&ldquo;{l.reason}&rdquo;</p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 border-t border-white/5 pt-4">
              <Button variant="ghost" className="flex-1 text-[10px] uppercase text-destructive hover:bg-destructive/10" onClick={() => handleAction(l.id, 'REJECT')}>REJECT</Button>
              <Button className="flex-1 text-[10px] uppercase" onClick={() => handleAction(l.id, 'APPROVE')}>AUTHORIZE</Button>
            </CardFooter>
          </Card>
        ))}

        {leaves.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
            <Info className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground uppercase text-xs font-mono tracking-widest">No pending leave authorizations for this batch.</p>
          </div>
        )}
      </div>
    </div>
  )
}
