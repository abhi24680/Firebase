
"use client"

import { useState } from "react"
import { Building2, Plus, Edit2, Trash2, Users, Layers, Activity } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

export default function AdminDepartments() {
  const [departments, setDepartments] = useState([
    { id: "1", name: "Computer Science", code: "CSE", count: 420, hod: "Dr. Alan Turing", health: 98 },
    { id: "2", name: "Artificial Intelligence", code: "AI", count: 180, hod: "Dr. Grace Hopper", health: 95 },
    { id: "3", name: "Cyber Security", code: "CY", count: 150, hod: "Dr. Kevin Mitnick", health: 92 },
    { id: "4", name: "Mechanical Engineering", code: "ME", count: 310, hod: "Dr. Nikola Tesla", health: 88 },
  ])

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id))
    toast({
      title: "DEPT_REMOVED",
      description: "Department cluster has been decommissioned from global registry.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Department Clusters</h1>
          <p className="text-muted-foreground uppercase text-[10px] font-mono tracking-widest">Manage academic nodes and structural capacity across the network.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-bold uppercase tracking-tighter rounded-none h-11 px-8">
              <Plus className="mr-2 h-4 w-4" />
              REGISTER_NEW_CLUSTER
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-sidebar-border">
            <DialogHeader>
              <DialogTitle className="uppercase font-headline text-xl">Initialize Department Node</DialogTitle>
              <DialogDescription className="text-xs uppercase font-mono tracking-tighter">Configure a new institutional unit in the compute mesh.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Department Identity</Label>
                <Input id="name" placeholder="e.g. Civil Engineering" className="bg-secondary/50 border-white/5 font-bold uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="code" className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Short Code</Label>
                  <Input id="code" placeholder="e.g. CE" className="bg-secondary/50 border-white/5 font-mono uppercase" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="count" className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Capacity</Label>
                  <Input id="count" type="number" placeholder="400" className="bg-secondary/50 border-white/5 font-mono" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full h-12 uppercase font-bold tracking-widest" onClick={() => toast({ title: "DEPT_CREATED", description: "New cluster successfully synchronized." })}>CONFIRM INITIALIZATION</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-sidebar/30 border-sidebar-border p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Layers className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Global Clusters</span>
          </div>
          <p className="text-4xl font-headline font-bold">{departments.length}</p>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">Nodes Active</p>
        </Card>
        <Card className="bg-sidebar/30 border-sidebar-border p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Users className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Total Population</span>
          </div>
          <p className="text-4xl font-headline font-bold">1,060</p>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">Verified Students</p>
        </Card>
        <Card className="bg-sidebar/30 border-sidebar-border p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-accent">
            <Activity className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Avg Sync Health</span>
          </div>
          <p className="text-4xl font-headline font-bold">94%</p>
          <p className="text-[10px] text-muted-foreground font-mono uppercase">Infrastructure Load</p>
        </Card>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase tracking-widest font-bold pl-6 py-4">Node Identity</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Code</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Current Population</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Lead HOD</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                  <TableCell className="font-bold text-sm pl-6 py-5 uppercase tracking-tight">{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-primary border-primary/20 bg-primary/5 uppercase text-[10px]">{dept.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 max-w-[120px]">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>{dept.count} Units</span>
                        <span className="text-emerald-500">{dept.health}%</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${dept.health}%` }} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">{dept.hod}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(dept.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
