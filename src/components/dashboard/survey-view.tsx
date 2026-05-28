
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, ArrowRight, Clock } from "lucide-react"

const surveys = [
  {
    id: "s1",
    title: "Faculty Performance Evaluation - SEM 3",
    description: "Provide constructive feedback on subject delivery and laboratory instruction.",
    expiry: "Oct 30, 2024",
    category: "Academic",
    status: "active"
  },
  {
    id: "s2",
    title: "Campus Infrastructure Feedback",
    description: "Help us improve library resources and laboratory facilities.",
    expiry: "Nov 05, 2024",
    category: "Institutional",
    status: "active"
  }
]

export function SurveyView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {surveys.map((survey) => (
        <Card key={survey.id} className="bg-sidebar/30 border-sidebar-border group hover:border-primary/50 transition-all">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge variant="outline" className="text-[10px] font-mono uppercase opacity-60">
                {survey.category}
              </Badge>
              <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                <Clock className="h-3 w-3" />
                EXPIRES: {survey.expiry}
              </div>
            </div>
            <CardTitle className="text-xl font-headline uppercase">{survey.title}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-2">
              {survey.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all group/btn h-11">
              <ClipboardList className="mr-2 h-4 w-4" />
              START SURVEY
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </CardContent>
        </Card>
      ))}
      {surveys.length === 0 && (
        <Card className="md:col-span-2 bg-sidebar/30 border-dashed border-sidebar-border py-20">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <ClipboardList className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">No Active Surveys</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
