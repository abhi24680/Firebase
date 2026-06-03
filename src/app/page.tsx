"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Activity, Cpu, Database, ArrowRight, Camera, Zap, BarChart3, Users, Network, Code2, Globe, History, Lightbulb, Rocket } from "lucide-react"
import { Logo } from "@/components/logo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full grid-background opacity-20 animate-grid-flow" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(4,7,14,0.8)_100%)]" />
      </div>

      <header className="h-20 border-b border-white/5 glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
          <Logo size="lg" />
          <nav className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {['Architecture', 'Technology', 'Journey', 'Infrastructure'].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-primary transition-all relative group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </Link>
            ))}
          </nav>
          <Button 
            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all rounded-none px-8 font-bold text-xs tracking-tighter shadow-lg hover:shadow-primary/20"
            asChild
          >
            <Link href="/auth/login">LOGIN TERMINAL</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-[90vh] flex flex-col items-center justify-center px-8 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-[0.2em] mb-12 animate-fade-in">
            <Zap className="h-3 w-3 animate-pulse" /> Infrastructure v2.1 Enterprise
          </div>
          
          <h1 className="text-[12vw] md:text-[10rem] font-headline font-bold leading-[0.8] mb-8 select-none tracking-tighter">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x text-glow">
              EDUGO
            </span>
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Next-generation Smart Classroom Infrastructure powered by <span className="text-white font-semibold">RFID automation</span>, 
            <span className="text-white font-semibold text-glow"> AI-driven occupancy intelligence</span>, and institutional analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in zoom-in duration-1000 delay-300">
            <Button size="lg" className="h-16 px-12 text-sm font-bold bg-primary hover:bg-primary/90 rounded-none shadow-[0_0_30px_rgba(59,130,246,0.4)] group transition-all" asChild>
              <Link href="/auth/login" className="flex items-center gap-3">
                ENTER DASHBOARD
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 text-sm font-bold glass rounded-none hover:bg-white/5 border-white/10">
              VIEW DOCUMENTATION
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-32 px-4">
            {[
              { label: "Attendance Accuracy", val: "99.9%", icon: Shield, color: "text-primary" },
              { label: "AI Count Verification", val: "Real-time", icon: Cpu, color: "text-accent" },
              { label: "Departments", val: "Multi-Sync", icon: Database, color: "text-primary" },
              { label: "Energy Optimization", val: "Active", icon: Zap, color: "text-accent" },
            ].map((stat, i) => (
              <div key={i} className="glass p-6 border-white/5 hover:border-primary/50 transition-all group hover:-translate-y-1">
                <stat.icon className={cn("h-6 w-6 mb-4", stat.color)} />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-headline font-bold">{stat.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Plans Section */}
        <section id="technology" className="py-40 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-primary border-primary/20 px-4 py-1 text-[10px] font-mono tracking-widest">ROADMAP_2025</Badge>
              <h2 className="text-5xl md:text-7xl font-headline font-bold leading-none uppercase">Technology Plans</h2>
            </div>
            <p className="text-muted-foreground text-sm max-w-md uppercase font-mono tracking-tight leading-relaxed">
              Engineering the future of autonomous campus environments through a decentralized compute mesh and multi-modal AI inference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: "P2PNet AI Integration", 
                desc: "Simulating high-performance vision models for crowd counting without compromising privacy.",
                icon: Camera,
                tag: "PHASE_1"
              },
              { 
                title: "Decentralized RFID Mesh", 
                desc: "Edge-based authentication nodes that function independently of central network availability.",
                icon: Network,
                tag: "PHASE_2"
              },
              { 
                title: "Real-time Sync Engine", 
                desc: "Sub-50ms latency for global institutional data synchronization across all terminal nodes.",
                icon: Zap,
                tag: "ACTIVE"
              },
              { 
                title: "Edge Compute Nodes", 
                desc: "Low-power, high-throughput inference hardware deployed at every classroom ingress point.",
                icon: Cpu,
                tag: "PLANNED"
              }
            ].map((plan, i) => (
              <Card key={i} className="bg-sidebar/20 border-white/5 hover:border-primary/50 transition-all p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className="text-[8px] font-mono bg-white/5 text-muted-foreground border-none">{plan.tag}</Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold uppercase tracking-tight">{plan.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed uppercase font-mono">{plan.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="py-20 px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-headline font-bold mb-6">INTELLIGENT COMMAND</h2>
            <p className="text-muted-foreground uppercase text-xs tracking-[0.3em]">Operational Oversight & Analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            <Card className="glass border-white/10 animate-float [animation-delay:0s] hover:neon-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">LIVE_STATUS</Badge>
                  <Users className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase">Classroom Count</h3>
                <p className="text-4xl font-headline font-bold text-emerald-500">42/45</p>
                <div className="mt-6 space-y-2">
                  <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[93%] animate-shimmer" />
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">AI_VERIFICATION: VERIFIED</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 animate-float [animation-delay:1.5s] hover:neon-glow transition-all">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <Badge className="bg-primary/10 text-primary border-primary/20">RFID_LOGS</Badge>
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase">Sync Activity</h3>
                <div className="space-y-3 mt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between text-[10px] font-mono border-b border-white/5 pb-2">
                      <span className="text-muted-foreground">ENTRY_NODE_0{i}</span>
                      <span className="text-primary">10:45:2{i} AM</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 animate-float [animation-delay:0.7s] hover:neon-glow transition-all lg:col-span-1 md:col-span-2">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <Badge className="bg-accent/10 text-accent border-accent/20">ANALYTICS</Badge>
                  <BarChart3 className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase">Dept Performance</h3>
                <div className="flex items-end gap-2 h-20 mt-6">
                  {[40, 70, 45, 90, 65, 80].map((h, i) => (
                    <div 
                      key={i} 
                      style={{ height: `${h}%` }} 
                      className="flex-1 bg-accent/40 hover:bg-accent transition-colors rounded-t-sm"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* About Our Journey Section */}
        <section id="journey" className="py-40 bg-sidebar/10 relative">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <Badge className="bg-accent/10 text-accent border-accent/20 font-mono text-[10px] tracking-widest uppercase">OUR_MISSION</Badge>
                <h2 className="text-5xl md:text-7xl font-headline font-bold leading-tight uppercase">About Our Journey</h2>
              </div>
              <div className="space-y-6 text-muted-foreground text-sm uppercase font-mono tracking-tight leading-relaxed">
                <p>
                  Edugo was born from a singular vision: to eliminate the friction of institutional administrative overhead. What started as a simple RFID experimental node has evolved into a comprehensive institutional mesh.
                </p>
                <p>
                  Our journey has been defined by the pursuit of "Invisible Automation." We believe that technology should serve the educational experience, not distract from it. By automating presence verification, we reclaim valuable instructional time for both students and faculty.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                      <History className="h-4 w-4" />
                      <span className="text-[10px] font-bold tracking-widest">ORIGIN_2023</span>
                    </div>
                    <p className="text-[10px]">Pioneered decentralized RFID scanning protocols in single-department pilots.</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-accent">
                      <Rocket className="h-4 w-4" />
                      <span className="text-[10px] font-bold tracking-widest">EXPANSION_2024</span>
                    </div>
                    <p className="text-[10px]">Introduced P2Net AI vision layers to provide dual-factor attendance verification.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse-slow" />
              <Card className="glass border-white/10 overflow-hidden relative z-10">
                <div className="p-12 space-y-8">
                  <div className="h-12 w-12 rounded bg-primary/20 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <blockquote className="text-2xl font-headline font-bold italic text-white leading-tight">
                    "We don't just count students; we enable institutional intelligence by bridging the gap between physical presence and digital records."
                  </blockquote>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 glass mt-40">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col gap-4">
            <Logo size="md" className="opacity-50 grayscale hover:grayscale-0 transition-all" />
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest max-w-sm">
              Edugo Infrastructure. Next-gen institutional technology for the autonomous age.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">System</h4>
              <nav className="flex flex-col gap-2 text-[10px] text-muted-foreground uppercase font-mono">
                <Link href="#" className="hover:text-primary transition-colors">Nodes</Link>
                <Link href="#" className="hover:text-primary transition-colors">API Docs</Link>
                <Link href="#" className="hover:text-primary transition-colors">Latency</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Security</h4>
              <nav className="flex flex-col gap-2 text-[10px] text-muted-foreground uppercase font-mono">
                <Link href="#" className="hover:text-primary transition-colors">Encrypted</Link>
                <Link href="#" className="hover:text-primary transition-colors">Auth Node</Link>
                <Link href="#" className="hover:text-primary transition-colors">Audit</Link>
              </nav>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              STATUS: SYSTEM_OPTIMAL
            </div>
            <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">
              © 2024 EDUGO_CORE.PROD.BUILD_2.1.0-RC
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
