
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const sizes = {
    sm: "h-6 w-6 text-lg",
    md: "h-8 w-8 text-xl",
    lg: "h-10 w-10 text-2xl",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={cn("flex items-center gap-3 group cursor-default", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-primary overflow-hidden transition-transform group-hover:scale-110",
        sizes[size]
      )}>
        {/* Modern Geometric Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-white/20 rotate-45" />
        
        {/* Stylized 'E' using SVG for sharpness */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="relative z-10 h-3/5 w-3/5 text-primary-foreground"
        >
          <path d="M19 6H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12" />
          <path d="M5 12h10" />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className={cn(
          "font-headline font-bold tracking-tighter text-foreground uppercase",
          textSizes[size]
        )}>
          Edu<span className="text-primary">go</span>
        </span>
      )}
    </div>
  )
}
