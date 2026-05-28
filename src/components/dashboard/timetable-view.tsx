
"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TimetableView() {
  const schedule = [
    { day: "MON", periods: ["DSA", "OS", "Break", "CN", "Maths"] },
    { day: "TUE", periods: ["Maths", "CN", "Break", "DSA", "DSA Lab"] },
    { day: "WED", periods: ["OS", "OS Lab", "Break", "CN", "Ethical Hacking"] },
    { day: "THU", periods: ["Ethical Hacking", "DSA", "Break", "Maths", "Seminar"] },
    { day: "FRI", periods: ["CN", "Maths", "Break", "OS", "Club Activity"] },
  ]

  const timeSlots = ["09:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "01:30 PM"]

  return (
    <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
      <CardHeader className="border-b border-white/5">
        <CardTitle className="text-xl font-headline uppercase tracking-tighter">Semester III Master Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-primary w-24">Day / Slot</TableHead>
              {timeSlots.map((slot) => (
                <TableHead key={slot} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                  {slot}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((row) => (
              <TableRow key={row.day} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-headline font-bold text-muted-foreground uppercase">{row.day}</TableCell>
                {row.periods.map((period, i) => (
                  <TableCell key={i} className="text-center">
                    <div className={cn(
                      "p-2 rounded text-[10px] font-mono font-bold uppercase border",
                      period === 'Break' ? 'bg-white/5 border-transparent opacity-30' : 
                      period === 'DSA' ? 'bg-primary/10 border-primary/20 text-primary' :
                      period.includes('Lab') ? 'bg-accent/10 border-accent/20 text-accent' :
                      'bg-secondary/50 border-sidebar-border text-muted-foreground'
                    )}>
                      {period}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
