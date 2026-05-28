
"use client"

import { useState } from "react"
import { UserCheck, ShieldAlert, GraduationCap, Building2, Search } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

export default function HODApprovals() {
  const [facultyRequests, setFacultyRequests] = useState([
    { id: "f-1", name: "Dr. Richard Feynman", email: "feynman.r@providence.edu.in", dept: "CSE", status: "pending" },
    { id: "f-2", name: "Dr. Marie Curie", email: "curie.m@providence.edu.in", dept: "CSE", status: "pending" },
  ])

  const [leaveRequests, setLeaveRequests] = useState([
    { id: "l-1", name: "Abhijith PRC", roll: "CSE23-003", reason: "Fever and rest", dates: "Oct 24 - Oct 26", status: "pending" },
  ])

  const handleApproveFaculty = (id: string) => {
    setFacultyRequests(facultyRequests.filter(f => f.id !== id))
    toast({
      title: "FACULTY_AUTHORIZED",
      description: "Academic node activated.",
    })
  }

  const handleApproveLeave = (id: string) => {
    setLeaveRequests(leaveRequests.filter(l => l.id !== id))
    toast({
      title: "LEAVE_APPROVED",
      description: "Student attendance status updated for selected dates.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Validation Queue</h1>
        <p className="text-muted-foreground">Authorize faculty nodes and approve student leave requests.</p>
      </div>

      <Tabs defaultValue="faculty" className="w-full">
        <TabsList className="bg-secondary/50 p-1 rounded-lg w-[400px]">
          <TabsTrigger value="faculty" className="flex-1 text-[10px] uppercase font-bold">Faculty Nodes</TabsTrigger>
          <TabsTrigger value="leave" className="flex-1 text-[10px] uppercase font-bold">Leave Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyRequests.map((f) => (
              <Card key={f.id} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase">{f.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{f.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="flex gap-2 border-t border-white/5 pt-4">
                  <Button variant="ghost" className="flex-1 text-[10px] uppercase text-destructive hover:bg-destructive/10">REJECT</Button>
                  <Button className="flex-1 text-[10px] uppercase" onClick={() => handleApproveFaculty(f.id)}>APPROVE</Button>
                </CardFooter>
              </Card>
            ))}
            {facultyRequests.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-muted-foreground uppercase text-xs font-mono tracking-widest">No pending faculty authorizations.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="leave" className="mt-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaveRequests.map((l) => (
              <Card key={l.id} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-[9px] border-primary/20 text-primary">PENDING_HOD</Badge>
                    <span className="text-[10px] font-mono text-muted-foreground">{l.dates}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                      <GraduationCap className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase">{l.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{l.roll}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                   <p className="text-xs text-muted-foreground italic">&ldquo;{l.reason}&rdquo;</p>
                </CardContent>
                <CardFooter className="flex gap-2 border-t border-white/5 pt-4">
                  <Button variant="ghost" className="flex-1 text-[10px] uppercase text-destructive hover:bg-destructive/10">DENY</Button>
                  <Button className="flex-1 text-[10px] uppercase" onClick={() => handleApproveLeave(l.id)}>AUTHORIZE</Button>
                </CardFooter>
              </Card>
            ))}
            {leaveRequests.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-muted-foreground uppercase text-xs font-mono tracking-widest">No pending leave applications.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
