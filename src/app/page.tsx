import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Activity, Cpu, Database } from "lucide-react"
import { Logo } from "@/components/logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground">
      <header className="h-20 border-b border-border/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
          <Logo size="lg" />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Architecture</Link>
            <Link href="#" className="hover:text-primary transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-primary transition-colors">Infrastructure</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button className="bg-primary text-primary-foreground font-semibold px-6 rounded-none skew-x-[-10deg]" asChild>
              <Link href="/auth/login">
                <span className="skew-x-[10deg]">LOGIN</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/rfidgrid/1920/1080')] opacity-5 bg-fixed"></div>
          <div className="absolute top-1/4 left-1/4 h-64 w-64 bg-accent/20 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 bg-primary/20 blur-[120px] rounded-full"></div>
          
          <div className="max-w-5xl mx-auto text-center px-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-widest mb-8">
              <Activity className="h-3 w-3 animate-pulse" /> Production Ready System v2.1
            </div>
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter mb-8 leading-[0.9]">
              AUTONOMOUS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient">ATTENDANCE</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-body leading-relaxed">
              Industrial-grade RFID integration coupled with GPU-accelerated P2Net crowd inference for absolute accuracy in educational environments.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="h-14 px-8 text-lg font-bold min-w-[200px]" asChild>
                <Link href="/auth/login">Enter Terminal</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-border/50 hover:bg-white/5 min-w-[200px]">
                Documentation
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group">
              <Shield className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-headline font-bold mb-4">Secure RFID</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Multi-point serial reader network with encrypted roll-number mapping and live heartbeat monitoring.</p>
            </div>
            <div className="p-8 bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group">
              <Cpu className="h-10 w-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-headline font-bold mb-4">P2Net Inference</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Real-time crowd density estimation powered by NVIDIA CUDA cores for cross-verifying physical presence.</p>
            </div>
            <div className="p-8 bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group">
              <Database className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-headline font-bold mb-4">Sheet Sync</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Seamless gspread background worker tasks that map local PostgreSQL logs to Google Spreadsheet cells.</p>
            </div>
            <div className="p-8 bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all group">
              <Activity className="h-10 w-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-headline font-bold mb-4">Live Dashboard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Role-specific WebSocket interfaces providing zero-latency attendance updates to Faculty and HODs.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <Logo size="md" className="grayscale opacity-50" />
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            © 2024 Edugo Infrastructure. Internal Production Build v2.1.0-rc
          </p>
          <div className="flex items-center gap-6 text-muted-foreground hover:text-foreground">
            <span className="text-xs font-mono">STATUS: ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
