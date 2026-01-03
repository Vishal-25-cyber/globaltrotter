import { Globe as GlobeIcon } from 'lucide-react';

interface GlobeProps {
  className?: string;
}

export function Globe({ className }: GlobeProps) {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Animated globe container */}
      <div className="absolute inset-0 rounded-full bg-gradient-ocean opacity-20 blur-3xl animate-pulse" />
      
      {/* Main globe */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/80 via-primary to-primary/60 shadow-glow float-animation overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 rounded-full opacity-30">
          {/* Horizontal lines */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-primary-foreground/40"
              style={{ top: `${20 + i * 15}%` }}
            />
          ))}
          {/* Vertical curves */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-primary-foreground/40"
              style={{ 
                left: `${15 + i * 14}%`,
                transform: `scaleX(${1 - Math.abs(i - 2.5) * 0.15})`,
              }}
            />
          ))}
        </div>
        
        {/* Highlight */}
        <div className="absolute top-4 left-8 w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-foreground/20 blur-2xl" />
        
        {/* Location pins */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 rounded-full bg-accent animate-ping" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-accent animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 rounded-full bg-accent animate-ping" style={{ animationDelay: '1s' }} />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <GlobeIcon className="w-16 h-16 md:w-20 md:h-20 text-primary-foreground/60" />
        </div>
      </div>
      
      {/* Orbit ring */}
      <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute -inset-8 rounded-full border border-dashed border-primary/20 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
    </div>
  );
}
