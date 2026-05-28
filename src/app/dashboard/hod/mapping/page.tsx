
"use client"

import { useState } from "react"
import { BookOpen, User, Plus, Trash2, Edit2, Link } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

export default function HODMapping() {
  const [mappings, setMappings] = useState([
    { id: "1", subject: "Data Structures", code: "CSE201", faculty: "Dr. Alan Turing", sem: "3" },
    { id: "2", subject: "Operating Systems", code: "CSE203", faculty: "Dr. Grace Hopper", sem: "3" },
    { id: "3", subject: "Computer Networks", code: "CSE202", faculty: "Dr. Vint Cerf", sem: "3" },
  ])

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">Subject-Faculty Mapping</h1>
          <p className="text-muted-foreground">Assign instructors to academic modules for current semester.</p>
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" />
          NEW ASSIGNMENT
        </Button>
      </div>

      <Card className="bg-sidebar/30 border-sidebar-border overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-white/5">
                <TableHead className="text-[10px] uppercase font-bold pl-6">Academic Module</TableHead>
                <TableHead className="text-[10px] uppercase font-bold">Assigned Faculty</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-center">Semester</TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-right pr-6">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mappings.map((m) => (
                <TableRow key={m.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm uppercase">{m.subject}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase">{m.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{m.faculty}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-[10px] font-mono">SEM_{m.sem}</Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 text-destructive">
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
