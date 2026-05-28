
"use client"

import { useState } from "react"
import { UserCheck, ShieldAlert, UserPlus, UserMinus, Briefcase } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminHODs() {
  const [requests, setRequests] = useState([
    { id: "req-1", name: "Dr. Sarah Connor", dept: "Cyber Security", email: "sarah.c@providence.edu.in", status: "pending" },
    { id: "req-2", name: "Dr. John Wick", dept: "AI", email: "wick.j@providence.edu.in", status: "pending" },
  ])

  const [activeHods, setActiveHods] = useState([
    { id: "hod-1", name: "Dr. Alan Turing", dept: "Computer Science", email: "turing.a@providence.edu.in" },
  ])

  const handleApprove = (reqId: string) => {
    const req = requests.find(r => r.id === reqId)
    if (req) {
      setActiveHods([...activeHods, { ...req, id: `hod-${Date.now()}` }])
      setRequests(requests.filter(r => r.id !== reqId))
      toast({
        title: "HOD_AUTHORIZED",
        description: `${req.name} has been granted administrative credentials.`,
      })
    }
  }

  const handleDecommission = (id: string) => {
    setActiveHods(activeHods.filter(h => h.id !== id))
    toast({
      variant: "destructive",
      title: "HOD_DECOMMISSIONED",
      description: "Administrative access revoked.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Administrative Nodes (HOD)</h1>
          <p className="text-muted-foreground">Manage department leadership and authorization requests.</p>
        </div>
        <Button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          DIRECT HOD ADDITION
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-1 bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Verification Requests</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="p-4 bg-secondary/30 border border-white/5 rounded-lg space-y-4">
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase">{req.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{req.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] border-primary/20 text-primary uppercase">{req.dept}</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive hover:bg-destructive/10" onClick={() => setRequests(requests.filter(r => r.id !== req.id))}>REJECT</Button>
                    <Button size="sm" className="h-7 text-[10px] bg-primary" onClick={() => handleApprove(req.id)}>APPROVE</Button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-xs uppercase font-mono italic opacity-50">
                All verification queues cleared.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="xl:col-span-2 bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Active Command Center</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow className="border-white/5">
                  <TableHead className="text-[10px] uppercase font-bold pl-6">Administrator</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold">Assigned Dept</TableHead>
                  <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeHods.map((hod) => (
                  <TableRow key={hod.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold uppercase">{hod.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{hod.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select defaultValue={hod.dept}>
                        <SelectTrigger className="w-[180px] h-8 text-[10px] bg-secondary/50 border-white/5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-sidebar-border">
                          <SelectItem value="Computer Science">CSE</SelectItem>
                          <SelectItem value="Artificial Intelligence">AI</SelectItem>
                          <SelectItem value="Cyber Security">CY</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDecommission(hod.id)}>
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
