
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: "h-5 w-5 text-base",
  md: "h-7 w-7 text-lg",
  lg: "h-9 w-9 text-xl",
} as const;

const TEXT_SIZES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

export function Logo({ className, iconOnly = false, size = "md" }: LogoProps) {

  return (
    <div className={cn("flex items-center gap-3 group cursor-default", className)}>
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-primary overflow-hidden transition-all duration-500 group-hover:scale-110 animate-float animate-glow-pulse",
        SIZES[size]
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent opacity-90" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-white/20 rotate-45" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)] animate-pulse" />
        
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="relative z-10 h-3/5 w-3/5 text-primary-foreground drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
        >
          <path d="M19 6H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12" />
          <path d="M5 12h10" />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className={cn(
          "font-headline font-bold tracking-tighter text-foreground uppercase",
          TEXT_SIZES[size]
        )}>
          Edu<span className="text-primary">go</span>
        </span>
      )}
    </div>
  )
}
