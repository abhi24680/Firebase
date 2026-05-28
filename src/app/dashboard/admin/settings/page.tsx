
"use client"

import { Database, Shield, Zap, Bell, Globe, Cpu } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"

export default function AdminSettings() {
  const handleSave = () => {
    toast({
      title: "CORE_SETTINGS_SYNCED",
      description: "Global infrastructure parameters updated.",
    })
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-headline font-bold tracking-tight uppercase">System Parameters</h1>
        <p className="text-muted-foreground">Adjust global core architecture and institutional policies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Access Controls</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-mono tracking-tighter">Manage institutional authentication levels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">Auto-Approve Students</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Verified @student emails skip HOD queue</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">Multifactor Auth</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Enforce MFA for administrative nodes</p>
              </div>
              <Switch />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between opacity-50">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">RFID Strict Mode</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Require dual-factor proximity scans</p>
              </div>
              <Switch disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">AI & Compute</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-mono tracking-tighter">Configure inference and automation nodes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">Live Crowd Counting</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Enable P2Net computer vision verification</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">Anomaly Detection</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Automated alerts for attendance irregularities</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold uppercase">Energy Optimization</Label>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">Auto-power off systems in empty rooms</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sidebar/30 border-sidebar-border md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-500" />
              <CardTitle className="text-sm font-semibold uppercase tracking-wider">Network & Sync</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Sync Frequency</Label>
                <Badge variant="outline" className="font-mono text-[9px]">REAL-TIME</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Global RFID event synchronization happens instantly via the decentralized compute mesh.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">Data Retention</Label>
                <Badge variant="outline" className="font-mono text-[9px]">8 SEMESTERS</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Attendance logs are immutable and archived after the academic cycle completes.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">API Status</Label>
                <Badge variant="outline" className="font-mono text-[9px] text-emerald-500 border-emerald-500/20">OPERATIONAL</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Integration endpoints for the college management ERP are online and authorized.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 border-t border-white/5 pt-8">
        <Button variant="outline" className="border-white/5 hover:bg-white/5 font-bold">RESET DEFAULTS</Button>
        <Button className="bg-primary px-8 font-bold" onClick={handleSave}>PERSIST CONFIGURATION</Button>
      </div>
    </div>
  )
}
