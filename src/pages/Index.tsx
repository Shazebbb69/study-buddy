import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import GhostBuddy from '@/components/GhostBuddy';
import { useStudyTimer, DURATION_OPTIONS } from '@/hooks/useStudyTimer';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const {
    formattedTime,
    status,
    todayMinutes,
    streak,
    focusDuration,
    setFocusDuration,
    startFocus,
    takeBreak,
    reset,
  } = useStudyTimer();

  const getStatusConfig = () => {
    switch (status) {
      case 'focusing':
        return { text: 'Focusing', className: 'bg-primary/15 text-primary' };
      case 'completed':
        return { text: 'Completed', className: 'bg-emerald-500/15 text-emerald-500 dark:text-emerald-400' };
      case 'break':
        return { text: 'On Break', className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' };
      default:
        return { text: 'Idle', className: 'bg-muted text-muted-foreground' };
    }
  };

  const statusConfig = getStatusConfig();
  const canEditDuration = status === 'idle' || status === 'break';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-8">
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="theme-toggle fixed top-5 right-5 z-10"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5 text-secondary-foreground" />
        ) : (
          <Moon className="w-5 h-5 text-secondary-foreground" />
        )}
      </button>

      {/* Main Container */}
      <main className="app-container w-full max-w-md px-8 py-12 sm:px-12 sm:py-14 flex flex-col items-center">
        {/* Ghost Buddy */}
        <div className="mb-5">
          <GhostBuddy status={status} />
        </div>

        {/* Status Badge */}
        <div className={`status-badge mb-8 ${statusConfig.className}`}>
          {statusConfig.text}
        </div>

        {/* Timer Display */}
        <div className="mb-5">
          <h1 className="timer-display text-6xl sm:text-7xl text-foreground">
            {formattedTime}
          </h1>
        </div>

        {/* Duration Selector */}
        <div className="flex gap-2 mb-10">
          {DURATION_OPTIONS.map((duration) => (
            <button
              key={duration}
              onClick={() => setFocusDuration(duration)}
              disabled={!canEditDuration}
              className={`duration-btn ${
                focusDuration === duration
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 text-secondary-foreground hover:bg-secondary'
              } ${!canEditDuration ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {duration}m
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-12">
          {status === 'idle' || status === 'break' || status === 'completed' ? (
            <button onClick={startFocus} className="btn-primary">
              Start Focus
            </button>
          ) : (
            <button onClick={reset} className="btn-secondary">
              Stop
            </button>
          )}
          
          {(status === 'focusing' || status === 'completed') && (
            <button onClick={takeBreak} className="btn-secondary">
              Take Break
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
          <p className="text-sm tracking-wide">
            Today: <span className="text-foreground font-medium">{todayMinutes} min</span> studied
          </p>
          {streak > 0 && (
            <p className="text-xs tracking-wide">
              Streak: <span className="text-primary font-medium">{streak} day{streak !== 1 ? 's' : ''}</span>
            </p>
          )}
        </div>
      </main>

      {/* Subtle branding */}
      <p className="mt-8 text-xs text-muted-foreground/40 tracking-widest uppercase">
        Study Buddy
      </p>
    </div>
  );
};

export default Index;
