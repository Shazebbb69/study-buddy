interface GhostBuddyProps {
  status: 'idle' | 'focusing' | 'completed' | 'break';
}

const GhostBuddy = ({ status }: GhostBuddyProps) => {
  const isActive = status === 'focusing';
  const isCompleted = status === 'completed';
  const isBreak = status === 'break';

  // Eye styles based on status
  const getEyes = () => {
    if (status === 'focusing') {
      return (
        <>
          <circle cx="44" cy="52" r="6" className="fill-primary" />
          <circle cx="76" cy="52" r="6" className="fill-primary" />
          <circle cx="46" cy="50" r="2" fill="white" opacity="0.8" />
          <circle cx="78" cy="50" r="2" fill="white" opacity="0.8" />
        </>
      );
    }
    if (status === 'completed') {
      return (
        <>
          <path d="M38 52 Q44 46 50 52" stroke="hsl(var(--status-completed))" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M70 52 Q76 46 82 52" stroke="hsl(var(--status-completed))" strokeWidth="3" strokeLinecap="round" fill="none" />
        </>
      );
    }
    if (status === 'break') {
      return (
        <>
          <path d="M38 52 L50 52" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" />
          <path d="M70 52 L82 52" stroke="hsl(var(--muted-foreground))" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    }
    // Idle - friendly eyes
    return (
      <>
        <ellipse cx="44" cy="52" rx="5" ry="6" className="fill-muted-foreground" />
        <ellipse cx="76" cy="52" rx="5" ry="6" className="fill-muted-foreground" />
        <circle cx="46" cy="50" r="2" fill="white" opacity="0.6" />
        <circle cx="78" cy="50" r="2" fill="white" opacity="0.6" />
      </>
    );
  };

  // Mouth based on status
  const getMouth = () => {
    if (status === 'focusing') {
      return <path d="M52 68 Q60 74 68 68" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }
    if (status === 'completed') {
      return <path d="M48 68 Q60 80 72 68" stroke="hsl(var(--status-completed))" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
    }
    if (status === 'break') {
      return <ellipse cx="60" cy="70" rx="4" ry="3" className="fill-muted-foreground" opacity="0.6" />;
    }
    return <path d="M50 68 Q60 76 70 68" stroke="hsl(var(--muted-foreground))" strokeWidth="2.5" strokeLinecap="round" fill="none" />;
  };

  // Blush for completed state
  const getBlush = () => {
    if (status === 'completed') {
      return (
        <>
          <ellipse cx="32" cy="60" rx="6" ry="4" fill="hsl(var(--status-completed))" opacity="0.2" />
          <ellipse cx="88" cy="60" rx="6" ry="4" fill="hsl(var(--status-completed))" opacity="0.2" />
        </>
      );
    }
    return null;
  };

  return (
    <div className={`relative transition-all duration-700 ${isActive ? 'ghost-glow-active' : 'ghost-glow'}`}>
      <svg
        width="120"
        height="130"
        viewBox="0 0 120 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-700 ${isActive ? 'scale-105' : 'scale-100'}`}
        style={{
          animation: isBreak ? 'none' : 'float 4s ease-in-out infinite',
        }}
      >
        <defs>
          {/* Gradient for ghost body */}
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="1" />
          </linearGradient>
          {/* Inner highlight */}
          <radialGradient id="ghostHighlight" cx="40%" cy="30%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          {/* Glow filter for active state */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow */}
        <ellipse 
          cx="60" 
          cy="122" 
          rx={isActive ? 28 : 24} 
          ry="6" 
          fill="black" 
          opacity={isActive ? 0.15 : 0.1}
          className="transition-all duration-500"
        />

        {/* Ghost body */}
        <path
          d="M60 8
             C28 8 12 35 12 62
             L12 95
             Q12 102 18 100 Q24 98 28 102 Q32 106 36 102 Q40 98 44 102 Q48 106 52 102 Q56 98 60 102 Q64 106 68 102 Q72 98 76 102 Q80 106 84 102 Q88 98 92 102 Q96 106 102 100 Q108 94 108 95
             L108 62
             C108 35 92 8 60 8Z"
          fill="url(#ghostGradient)"
          className="transition-all duration-500"
          filter={isActive ? 'url(#glow)' : undefined}
        />

        {/* Inner highlight overlay */}
        <path
          d="M60 12
             C32 12 18 37 18 62
             L18 90
             Q18 96 24 94 Q30 92 34 96 Q38 100 42 96 Q46 92 50 96 Q54 100 58 96 Q62 92 66 96 Q70 100 74 96 Q78 92 82 96 Q86 100 90 96 Q94 92 100 88
             L100 62
             C100 37 88 12 60 12Z"
          fill="url(#ghostHighlight)"
        />

        {/* Blush (for completed) */}
        {getBlush()}

        {/* Eyes */}
        {getEyes()}

        {/* Mouth */}
        {getMouth()}
      </svg>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default GhostBuddy;
