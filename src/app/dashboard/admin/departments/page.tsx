
"use client"

import { useState } from "react"
import { Building2, Plus, Edit2, Trash2, Users } from "lucide-react"
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
    { id: "1", name: "Computer Science", code: "CSE", count: 420, hod: "Dr. Alan Turing" },
    { id: "2", name: "Artificial Intelligence", code: "AI", count: 180, hod: "Dr. John McCarthy" },
    { id: "3", name: "Cyber Security", code: "CY", count: 150, hod: "Dr. Kevin Mitnick" },
  ])

  const handleDelete = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id))
    toast({
      title: "DEPT_REMOVED",
      description: "Department unit has been decommissioned.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Department Clusters</h1>
          <p className="text-muted-foreground">Manage academic units and structural capacity.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              NEW DEPARTMENT
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-sidebar-border">
            <DialogHeader>
              <DialogTitle className="uppercase font-headline">Initialize Department</DialogTitle>
              <DialogDescription>Create a new academic node in the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[10px] uppercase font-mono">Department Name</Label>
                <Input id="name" placeholder="e.g. Mechanical Engineering" className="bg-secondary/50 border-white/5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code" className="text-[10px] uppercase font-mono">Short Code</Label>
                <Input id="code" placeholder="e.g. ME" className="bg-secondary/50 border-white/5" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="count" className="text-[10px] uppercase font-mono">Student Capacity</Label>
                <Input id="count" type="number" placeholder="400" className="bg-secondary/50 border-white/5" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => toast({ title: "DEPT_CREATED", description: "Node added successfully." })}>CONFIRM INITIALIZATION</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Node Identity</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Code</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Population</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Current HOD</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((dept) => (
                <TableRow key={dept.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-semibold">{dept.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-primary border-primary/20 bg-primary/5 uppercase">{dept.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono">{dept.count}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs uppercase font-medium">{dept.hod}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
