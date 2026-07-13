"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield, Cpu, Database, ArrowRight, Zap, History, Lightbulb, Rocket, Eye, Target } from "lucide-react"
import { Logo } from "@/components/logo"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const NAV_ITEMS = ['Architecture', 'Journey', 'Infrastructure'];
const STATS = [
  { label: "Attendance Accuracy", val: "99.9%", icon: Shield, color: "text-primary" },
  { label: "AI Count Verification", val: "Real-time", icon: Cpu, color: "text-accent" },
  { label: "Departments", val: "Multi-Sync", icon: Database, color: "text-primary" },
  { label: "Energy Optimization", val: "Active", icon: Zap, color: "text-accent" },
];

interface Ripple {
  id: number
  x: number
  y: number
}

export default function LandingPage() {
  const [splash, setSplash] = useState(true)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [cursor, setCursor] = useState({ x: -200, y: -200 })
  const rippleId = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursor({ x: e.clientX, y: e.clientY })
  }, [])

  const handleClick = useCallback((e: React.MouseEvent) => {
    const id = ++rippleId.current
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600)
  }, [])

  if (splash) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15),transparent_70%)] animate-pulse-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-[-100px] rounded-full border border-primary/20 animate-ping-slow" />
            <div className="absolute inset-[-50px] rounded-full border border-primary/30 animate-ping-slower" />
            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-700">
              <Logo size="lg" />
              <h1 className="text-7xl md:text-9xl font-headline font-bold tracking-tighter select-none">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x text-glow">
                  EDUGO
                </span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                Initializing Infrastructure...
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden animate-in fade-in duration-700" onClick={handleClick} onMouseMove={handleMouseMove}>
      {/* Cursor Glow */}
      <div
        className="fixed pointer-events-none z-50 transition-transform duration-75 ease-linear"
        style={{ left: cursor.x - 150, top: cursor.y - 150, width: 300, height: 300 }}
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.12),transparent_70%)]" />
      </div>

      {/* Ripple Layer */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {ripples.map(r => (
          <span
            key={r.id}
            className="absolute rounded-full border border-primary/40 animate-ripple"
            style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40 }}
          />
        ))}
      </div>

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
            {NAV_ITEMS.map((item) => (
                <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-primary transition-all relative group py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </a>
            ))}
          </nav>
          <Button 
            className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all rounded-none px-8 font-bold text-xs tracking-tighter shadow-lg hover:shadow-primary/20"
            asChild
          >
            <Link to="/auth/login">LOGIN TERMINAL</Link>
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
            AI-Powered Smart Classroom Infrastructure for <span className="text-white font-semibold">Automated Attendance</span>, 
            <span className="text-white font-semibold text-glow"> Occupancy Intelligence</span>, Energy Optimization, and Institutional Analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in zoom-in duration-1000 delay-300">
            <Button size="lg" className="h-16 px-12 text-sm font-bold bg-primary hover:bg-primary/90 rounded-none shadow-[0_0_30px_rgba(59,130,246,0.4)] group transition-all" asChild>
              <Link to="/auth/login" className="flex items-center gap-3">
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
            {STATS.map((stat, i) => (
              <div key={i} className="glass p-6 border-white/5 hover:border-primary/50 transition-all group hover:-translate-y-1">
                <stat.icon className={cn("h-6 w-6 mb-4", stat.color)} />
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-headline font-bold">{stat.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Our Journey Section */}
        <section id="journey" className="py-40 bg-sidebar/10 relative">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12">
              {/* About EDUGO with Vision and Mission */}
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-primary/20 font-mono text-[10px] tracking-widest uppercase">ABOUT_EDUGO</Badge>
                <h2 className="text-5xl md:text-6xl font-headline font-bold leading-tight uppercase">Our Vision & Mission</h2>
                
                <div className="grid gap-8 pt-4">
                  <div className="flex gap-4 items-start group">
                    <div className="h-10 w-10 shrink-0 rounded bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-widest mb-1 text-primary">Vision</h4>
                      <p className="text-xs text-muted-foreground uppercase font-mono leading-relaxed">
                        To transform academic environments through seamless, invisible automation that empowers both students and educators, creating a future where presence is quantified without friction.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start group">
                    <div className="h-10 w-10 shrink-0 rounded bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent group-hover:text-black transition-colors">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-[12px] font-bold uppercase tracking-widest mb-1 text-accent">Mission</h4>
                      <p className="text-xs text-muted-foreground uppercase font-mono leading-relaxed">
                        To provide high-fidelity attendance tracking and institutional intelligence using a decentralized mesh of RFID and AI technologies, ensuring every instructional minute is valued and recorded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              {/* About Our Journey History */}
              <div className="space-y-6">
                <Badge className="bg-white/5 text-muted-foreground border-white/5 font-mono text-[10px] tracking-widest uppercase">OUR_HISTORY</Badge>
                <h2 className="text-4xl md:text-5xl font-headline font-bold leading-tight uppercase tracking-tighter">About Our Journey</h2>
                <div className="space-y-6 text-muted-foreground text-sm uppercase font-mono tracking-tight leading-relaxed">
                  <p>
                    Edugo was born from a singular vision: to eliminate the friction of institutional administrative overhead. What started as a simple RFID experimental node has evolved into a comprehensive institutional mesh.
                  </p>
                  <p>
                    Our journey has been defined by the pursuit of "Invisible Automation." We believe that technology should serve the educational experience, not distract from it.
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
            </div>
            
            <div className="sticky top-40 relative">
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
                <a href="#" className="hover:text-primary transition-colors">Nodes</a>
                <a href="#" className="hover:text-primary transition-colors">API Docs</a>
                <a href="#" className="hover:text-primary transition-colors">Latency</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Security</h4>
              <nav className="flex flex-col gap-2 text-[10px] text-muted-foreground uppercase font-mono">
                <a href="#" className="hover:text-primary transition-colors">Encrypted</a>
                <a href="#" className="hover:text-primary transition-colors">Auth Node</a>
                <a href="#" className="hover:text-primary transition-colors">Audit</a>
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
